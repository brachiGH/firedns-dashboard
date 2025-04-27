package etl

import (
	"context"
	"log"
	"time"

	"github.com/BrachiGH/firedns-dashboard/internal/database" // Adjust import path if needed
	"go.mongodb.org/mongo-driver/bson/primitive"              // For handling ISODate
)

// RunAnalyticsETL performs one cycle of the ETL process.
func RunAnalyticsETL() {
	log.Println("Starting Analytics ETL process...")
	startTime := time.Now()

	// --- Connect to Databases ---
	analyticsDB, err := database.GetAnalyticsDB()
	if err != nil {
		// Attempt to connect if not already connected (or handle this in main/init)
		log.Println("Analytics DB not connected, attempting connection...")
		tempDB := &database.Analytics_DB{}
		if err := tempDB.Connect(); err != nil {
			log.Printf("ETL Error: Failed to connect to Analytics MongoDB: %v", err)
			return
		}
		analyticsDB, _ = database.GetAnalyticsDB() // Get the now connected global instance
		// Ensure disconnect is handled on application shutdown
		// defer analyticsDB.Disconnect() // Be careful with defer in long-running routines
	}

	// Ensure PG connection is established (ConnectPG handles singleton)
	_, err = database.ConnectPG()
	if err != nil {
		log.Printf("ETL Error: Failed to connect to PostgreSQL: %v", err)
		return // Cannot proceed without PG connection
	}

	// --- Extract ---
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute) // Context for the entire ETL run
	defer cancel()

	log.Println("Fetching DNS messages from MongoDB...")
	dnsMessages, err := analyticsDB.FetchAllDNSMessages(ctx)
	if err != nil {
		log.Printf("ETL Error: Failed to fetch DNS messages: %v", err)
		return
	}
	log.Printf("Fetched %d DNS message documents.", len(dnsMessages))

	// --- Transform ---
	log.Println("Transforming data...")
	// Map to hold aggregated results per user ID
	userAnalyticsMap := make(map[string]*database.UserAnalytics)
	cutoffTime := time.Now().Add(-24 * time.Hour)

	for _, msg := range dnsMessages {
		// Get UserID for the IP
		userID, err := database.GetUserIDByIP(msg.IP)
		if err != nil {
			log.Printf("Warning: Failed to get user ID for IP %d: %v. Skipping this IP.", msg.IP, err)
			continue
		}
		if userID == "" {
			// log.Printf("Info: No user ID found for IP %d. Skipping.", msg.IP)
			continue // Skip if no user is linked to this IP
		}

		// Initialize map entry if needed
		if _, exists := userAnalyticsMap[userID]; !exists {
			userAnalyticsMap[userID] = &database.UserAnalytics{
				UserID:        userID,
				PassedCounts:  make(map[string]int),
				DroppedCounts: make(map[string]int),
			}
		}
		currentUserAnalytics := userAnalyticsMap[userID]

		// Process Passed domains
		processDomainList(msg.Passed, cutoffTime, currentUserAnalytics.PassedCounts)

		// Process Dropped domains (using "dorped" field name from example)
		processDomainList(msg.Dropped, cutoffTime, currentUserAnalytics.DroppedCounts)
	}

	log.Printf("Transformed analytics for %d users.", len(userAnalyticsMap))

	// --- Load ---
	log.Println("Loading transformed data into userAnalytics collection...")
	loadErrors := 0
	for userID, analyticsData := range userAnalyticsMap {
		analyticsData.LastUpdated = time.Now() // Set update timestamp

		loadCtx, loadCancel := context.WithTimeout(ctx, 10*time.Second) // Shorter context for each upsert
		err := analyticsDB.UpsertUserAnalytics(loadCtx, *analyticsData)
		loadCancel() // Cancel context immediately after use

		if err != nil {
			log.Printf("ETL Error: Failed to load analytics for user %s: %v", userID, err)
			loadErrors++
		}
	}

	duration := time.Since(startTime)
	log.Printf("Analytics ETL process finished in %s. Loaded data for %d users with %d errors.", duration, len(userAnalyticsMap)-loadErrors, loadErrors)
}

// processDomainList iterates through a list of [domain, timestamp] pairs,
// filters by time, and updates the counts map.
func processDomainList(domainList [][]interface{}, cutoffTime time.Time, counts map[string]int) {
	for _, entry := range domainList {
		if len(entry) != 2 {
			log.Printf("Warning: Malformed entry in domain list: %v. Skipping.", entry)
			continue
		}

		domain, okDomain := entry[0].(string)
		timestamp, okTime := entry[1].(primitive.DateTime) // MongoDB ISODate maps to primitive.DateTime
		// Or potentially time.Time depending on driver version/configuration

		if !okDomain {
			log.Printf("Warning: Domain is not a string: %v. Skipping.", entry[0])
			continue
		}
		if !okTime {
			// Attempt conversion if it comes as time.Time
			if tTime, okTTime := entry[1].(time.Time); okTTime {
				timestamp = primitive.NewDateTimeFromTime(tTime)
				okTime = true
			} else {
				log.Printf("Warning: Timestamp is not a recognized type (primitive.DateTime or time.Time): %T %v. Skipping.", entry[1], entry[1])
				continue
			}
		}

		entryTime := timestamp.Time() // Convert primitive.DateTime to time.Time
		if entryTime.After(cutoffTime) {
			counts[domain]++
		}
	}
}

// StartETLRoutine runs the ETL process periodically.
func StartETLRoutine(interval time.Duration) {
	log.Printf("Starting ETL routine to run every %s", interval)
	// Run once immediately
	go RunAnalyticsETL()

	// Then run on a ticker
	ticker := time.NewTicker(interval)
	go func() {
		for range ticker.C {
			RunAnalyticsETL()
		}
	}()

	// Note: This function returns immediately. The ticker runs in a separate goroutine.
	// Ensure the main application keeps running. Consider adding a stop channel for graceful shutdown.
}
