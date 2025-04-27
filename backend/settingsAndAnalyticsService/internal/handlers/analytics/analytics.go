package analytics

import (
	"context"
	"encoding/json"
	"log"
	"math"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/BrachiGH/firedns-dashboard/internal/database" // Adjust import path if needed
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// AnalyticsChartDataPoint represents a single point in the time-series chart.
type AnalyticsChartDataPoint struct {
	TimeLabel string `json:"name"` // e.g., "00:00", "03:00"
	Total     int64  `json:"total"`
	Blocked   int64  `json:"blocked"`
}

// AnalyticsDomainCount represents a domain and its associated count.
type AnalyticsDomainCount struct {
	Domain string `json:"domain"`
	Count  int    `json:"count"`
}

// AnalyticsResponse defines the structure of the JSON response for the analytics endpoint.
type AnalyticsResponse struct {
	TotalQueries    int64                     `json:"totalQueries"`
	BlockedQueries  int64                     `json:"blockedQueries"`
	BlockedPercent  float64                   `json:"blockedPercent"`
	QueryChartData  []AnalyticsChartDataPoint `json:"queryChartData"`
	ResolvedDomains []AnalyticsDomainCount    `json:"resolvedDomains"` // Top resolved domains
	BlockedDomains  []AnalyticsDomainCount    `json:"blockedDomains"`  // Top blocked domains
}

// AnalyticsHandler routes requests for analytics data.
func AnalyticsHandler(w http.ResponseWriter, r *http.Request) {
	// Extract userID from path, e.g., /analytics/user123
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 2 || pathParts[0] != "analytics" {
		http.Error(w, "Invalid path format. Expected /analytics/{userID}", http.StatusBadRequest)
		return
	}
	userID := pathParts[1]
	if userID == "" {
		http.Error(w, "User ID cannot be empty", http.StatusBadRequest)
		return
	}

	// Get database handle for analytics data
	db, err := database.GetAnalyticsDB()
	if err != nil {
		log.Printf("Error getting analytics database handle: %v", err)
		http.Error(w, "Server configuration error (database)", http.StatusInternalServerError)
		return
	}
	// Add a specific check if the collection handle could be nil (if applicable in GetAnalyticsDB)
	// if db.UserAnalyticsCollection == nil { // Adjust field name if necessary
	//  log.Println("Error: User Analytics MongoDB collection is not initialized.")
	//  http.Error(w, "Server configuration error (collection)", http.StatusInternalServerError)
	//  return
	// }

	switch r.Method {
	case http.MethodGet:
		getAnalyticsData(w, r, userID, db) // Pass db handle
	default:
		w.Header().Set("Allow", "GET")
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// getAnalyticsData handles GET requests to fetch user analytics data.
func getAnalyticsData(w http.ResponseWriter, r *http.Request, userID string, db *database.Analytics_DB) {
	log.Printf("GET /analytics/%s", userID)
	var userAnalytics database.UserAnalytics

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second) // Increased timeout for potential aggregation
	defer cancel()

	filter := bson.M{"userId": userID}
	err := db.UserAnalyticsCollection.FindOne(ctx, filter).Decode(&userAnalytics) // Adjust field name if necessary

	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("No analytics data found for userID %s, returning empty/default response.", userID)
			// Return a default empty response
			emptyResponse := AnalyticsResponse{
				QueryChartData:  []AnalyticsChartDataPoint{},
				ResolvedDomains: []AnalyticsDomainCount{},
				BlockedDomains:  []AnalyticsDomainCount{},
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(emptyResponse)
			return
		}
		log.Printf("Error fetching analytics data for userID %s from DB: %v", userID, err)
		http.Error(w, "Failed to retrieve analytics data", http.StatusInternalServerError)
		return
	}

	// --- Process Data ---
	response := processUserAnalytics(userAnalytics)

	// --- Send Response ---
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding analytics response for userID %s: %v", userID, err)
		// Avoid writing header again if already written by http.Error
	}
}

// processUserAnalytics transforms the raw UserAnalytics data into the API response format.
func processUserAnalytics(data database.UserAnalytics) AnalyticsResponse {
	var totalQueries, blockedQueries int64
	resolvedDomainsMap := make(map[string]int)
	blockedDomainsMap := make(map[string]int)

	// Calculate total/blocked queries and populate domain maps
	for domain, count := range data.PassedCounts {
		totalQueries += int64(count)
		resolvedDomainsMap[domain] = count
	}
	for domain, count := range data.DroppedCounts {
		totalQueries += int64(count)
		blockedQueries += int64(count)
		blockedDomainsMap[domain] = count
	}

	// Calculate percentage
	var blockedPercent float64
	if totalQueries > 0 {
		blockedPercent = math.Round((float64(blockedQueries)/float64(totalQueries))*10000) / 100 // Round to 2 decimal places
	}

	// Generate Chart Data (aggregate by time buckets)
	chartData := generateChartData(data.PassedDomains, data.DroppedDomains)

	// Get Top Domains
	topResolved := getTopDomains(resolvedDomainsMap, 6) // Get top 6 resolved
	topBlocked := getTopDomains(blockedDomainsMap, 6)   // Get top 6 blocked

	return AnalyticsResponse{
		TotalQueries:    totalQueries,
		BlockedQueries:  blockedQueries,
		BlockedPercent:  blockedPercent,
		QueryChartData:  chartData,
		ResolvedDomains: topResolved,
		BlockedDomains:  topBlocked,
	}
}

// generateChartData aggregates domain entries into time buckets for the chart.
// This is a simplified example using 3-hour buckets for the last 24 hours.
func generateChartData(passed []database.DomainEntry, dropped []database.DomainEntry) []AnalyticsChartDataPoint {
	// Initialize 8 buckets for 24 hours (3 hours each)
	buckets := make([]AnalyticsChartDataPoint, 8)
	now := time.Now()
	startTime := now.Truncate(3 * time.Hour) // Start from the beginning of the current 3-hour block

	// Initialize labels (e.g., "21:00", "18:00", ...)
	for i := 0; i < 8; i++ {
		bucketTime := startTime.Add(-time.Duration(i*3) * time.Hour)
		buckets[7-i] = AnalyticsChartDataPoint{ // Fill from the end
			TimeLabel: bucketTime.Format("15:04"), // HH:MM format
			Total:     0,
			Blocked:   0,
		}
	}
	cutoffTime := startTime.Add(-21 * time.Hour) // Start of the oldest bucket (24 hours ago relative to start of current bucket)

	// Aggregate passed domains
	for _, entry := range passed {
		if entry.Timestamp.Before(cutoffTime) {
			continue // Ignore data older than 24 hours
		}
		// Find the correct bucket index
		hoursAgo := startTime.Sub(entry.Timestamp).Hours()
		bucketIndex := 7 - int(math.Floor(hoursAgo/3.0)) // 7 is the latest bucket index

		if bucketIndex >= 0 && bucketIndex < 8 {
			buckets[bucketIndex].Total++
		}
	}

	// Aggregate dropped domains
	for _, entry := range dropped {
		if entry.Timestamp.Before(cutoffTime) {
			continue
		}
		hoursAgo := startTime.Sub(entry.Timestamp).Hours()
		bucketIndex := 7 - int(math.Floor(hoursAgo/3.0))

		if bucketIndex >= 0 && bucketIndex < 8 {
			buckets[bucketIndex].Total++ // Dropped also count towards total queries
			buckets[bucketIndex].Blocked++
		}
	}

	return buckets
}

// getTopDomains extracts the top N domains from a map based on count.
func getTopDomains(domainCounts map[string]int, limit int) []AnalyticsDomainCount {
	// Convert map to slice for sorting
	type kv struct {
		Key   string
		Value int
	}
	var ss []kv
	for k, v := range domainCounts {
		ss = append(ss, kv{k, v})
	}

	// Sort slice by value (count) in descending order
	sort.Slice(ss, func(i, j int) bool {
		return ss[i].Value > ss[j].Value
	})

	// Take the top N
	var topDomains []AnalyticsDomainCount
	for i := 0; i < len(ss) && i < limit; i++ {
		topDomains = append(topDomains, AnalyticsDomainCount{
			Domain: ss[i].Key,
			Count:  ss[i].Value,
		})
	}
	return topDomains
}
