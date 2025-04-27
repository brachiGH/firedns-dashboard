package database

import (
	"context"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DNSMessage represents the structure of documents in the DNSmessages collection.
// Use appropriate types (e.g., int64 for Long, time.Time for ISODate).
type DNSMessage struct {
	ID            interface{}     `bson:"_id,omitempty"`
	IP            int64           `bson:"ip"`
	Passed        [][]interface{} `bson:"passed,omitempty"` // [ [domain, timestamp], ... ]
	Dropped       [][]interface{} `bson:"dorped,omitempty"` // Typo in original data? Assuming "dropped" -> "dorped"
	QuestionCount int64           `bson:"QuestionCount,omitempty"`
}

// DomainEntry holds a domain and its timestamp for ordered lists.
type DomainEntry struct {
	Domain    string    `bson:"domain"`
	Timestamp time.Time `bson:"timestamp"`
}

// UserAnalytics represents the structure for the userAnalytics collection.
type UserAnalytics struct {
	UserID         string         `bson:"userId"`
	LastUpdated    time.Time      `bson:"lastUpdated"`
	PassedCounts   map[string]int `bson:"passedCounts"`
	DroppedCounts  map[string]int `bson:"droppedCounts"`
	PassedDomains  []DomainEntry  `bson:"passedDomains,omitempty"`  // Added: List of passed domains with timestamps
	DroppedDomains []DomainEntry  `bson:"droppedDomains,omitempty"` // Added: List of dropped domains with timestamps
}

type Analytics_DB struct {
	// collection *mongo.Collection // Original DNSmessages collection
	dnsMessagesCollection   *mongo.Collection // More specific name
	UserAnalyticsCollection *mongo.Collection // Collection for aggregated results
	client                  *mongo.Client
}

var global_analytics_db *Analytics_DB

func GetAnalyticsDB() (*Analytics_DB, error) {
	if global_analytics_db != nil {
		return global_analytics_db, nil
	}

	// Initialize if not connected (consider moving Connect call elsewhere, e.g., main)
	// For now, let's assume Connect is called externally before GetAnalyticsDB
	db := &Analytics_DB{}
	if err := db.Connect(); err != nil {
		return nil, err
	}
	return db, nil
}

func (a *Analytics_DB) Connect() error {
	// Interface on your machine.
	// MongoDB URI and database name
	uri := os.Getenv("MONGO_DB_URI")
	if uri == "" {
		return fmt.Errorf("MONGO_DB_URI environment variable not set")
	}
	const dbName = "FireDNSanalytics"
	const dnsMessagesCollectionName = "DNSmessages"
	const userAnalyticsCollectionName = "userAnalytics" // Added collection name

	// Set client options
	clientOptions := options.Client().ApplyURI(uri)

	var err error
	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second) // Added timeout
	defer cancel()
	a.client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		return fmt.Errorf("error connecting to analytics db: %w", err)
	}

	// Check the connection
	ctxPing, cancelPing := context.WithTimeout(context.Background(), 2*time.Second) // Added timeout
	defer cancelPing()
	err = a.client.Ping(ctxPing, nil)
	if err != nil {
		a.client.Disconnect(context.Background()) // Disconnect if ping fails
		return fmt.Errorf("error connecting to analytics db: connection check failed: %w", err)
	}

	fmt.Println("Connected to Analytics MongoDB!")

	// Get handles for the collections
	database := a.client.Database(dbName)
	a.dnsMessagesCollection = database.Collection(dnsMessagesCollectionName)
	a.UserAnalyticsCollection = database.Collection(userAnalyticsCollectionName) // Get handle for new collection

	// Set global db
	global_analytics_db = a

	return nil
}

func (a *Analytics_DB) Disconnect() error {
	if a.client == nil {
		return nil // Already disconnected or never connected
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // Added timeout
	defer cancel()
	if err := a.client.Disconnect(ctx); err != nil {
		return fmt.Errorf("error disconnecting from analytics db: %w", err)
	}
	a.client = nil            // Indicate disconnection
	global_analytics_db = nil // Clear global reference
	fmt.Println("Disconnected from Analytics MongoDB.")
	return nil
}

// FetchAllDNSMessages retrieves all documents from the DNSmessages collection.
// Consider adding filtering or pagination for very large collections.
func (a *Analytics_DB) FetchAllDNSMessages(ctx context.Context) ([]DNSMessage, error) {
	if a.dnsMessagesCollection == nil {
		return nil, fmt.Errorf("dnsMessagesCollection is not initialized")
	}

	cursor, err := a.dnsMessagesCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("error finding documents in DNSmessages: %w", err)
	}
	defer cursor.Close(ctx)

	var results []DNSMessage
	if err = cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("error decoding DNSmessages documents: %w", err)
	}

	return results, nil
}

// UpsertUserAnalytics updates or inserts analytics data for a specific user.
func (a *Analytics_DB) UpsertUserAnalytics(ctx context.Context, analytics UserAnalytics) error {
	if a.UserAnalyticsCollection == nil {
		return fmt.Errorf("userAnalyticsCollection is not initialized")
	}

	fmt.Println(analytics)

	filter := bson.M{"userId": analytics.UserID}
	update := bson.M{
		"$set": bson.M{
			"lastUpdated":    analytics.LastUpdated,
			"passedCounts":   analytics.PassedCounts,
			"droppedCounts":  analytics.DroppedCounts,
			"passedDomains":  analytics.PassedDomains,  // Store the ordered list of passed domains
			"droppedDomains": analytics.DroppedDomains, // Store the ordered list of dropped domains
			// Optionally update other fields if needed
		},
	}
	opts := options.Update().SetUpsert(true)

	result, err := a.UserAnalyticsCollection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return fmt.Errorf("error upserting user analytics for %s: %w", analytics.UserID, err)
	}

	if result.UpsertedCount > 0 {
		fmt.Printf("Inserted analytics for user %s\n", analytics.UserID)
	} else if result.ModifiedCount > 0 {
		fmt.Printf("Updated analytics for user %s\n", analytics.UserID)
	} else {
		fmt.Printf("Analytics for user %s already up-to-date.\n", analytics.UserID) // This might happen if data hasn't changed
	}

	return nil
}

// Example: Renaming Update to be specific if it's for DNSMessages
func (a *Analytics_DB) UpdateDNSMessage(ip bson.M, doc bson.M) (ID interface{}, err error) {
	if a.dnsMessagesCollection == nil {
		return nil, fmt.Errorf("dnsMessagesCollection is not initialized")
	}
	updateOptions := options.Update().SetUpsert(true)
	// Use dnsMessagesCollection explicitly
	insertOneResult, err := a.dnsMessagesCollection.UpdateOne(context.Background(), ip, doc, updateOptions)
	if err != nil {
		return nil, fmt.Errorf("error updating dns message db: %w", err)
	}

	return insertOneResult.UpsertedID, nil
}

// Example: Renaming UpdateMany
func (a *Analytics_DB) UpdateManyDNSMessages(updates []mongo.WriteModel) error {
	if a.dnsMessagesCollection == nil {
		return fmt.Errorf("dnsMessagesCollection is not initialized")
	}
	// Use dnsMessagesCollection explicitly
	_, err := a.dnsMessagesCollection.BulkWrite(context.Background(), updates)
	if err != nil {
		return fmt.Errorf("error updating many dns message docs: %w", err)
	}

	return nil
}
