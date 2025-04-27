package analytics

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/BrachiGH/firedns-dashboard/internal/database" // Adjust import path if needed
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// LogEntryResponse defines the structure for a single log entry returned by the API.
// Matches the frontend's BackendLogEntry interface.
type LogEntryResponse struct {
	Domain    string    `json:"domain"`
	Timestamp time.Time `json:"timestamp"` // Send as full timestamp, frontend can format
	Status    string    `json:"status"`    // "allowed" or "blocked"
}

// LogsHandler routes requests for user query logs.
func LogsHandler(w http.ResponseWriter, r *http.Request) {
	// Extract userID from path, e.g., /logs/user123
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 2 || pathParts[0] != "logs" {
		http.Error(w, "Invalid path format. Expected /logs/{userID}", http.StatusBadRequest)
		return
	}
	userID := pathParts[1]
	if userID == "" {
		http.Error(w, "User ID cannot be empty", http.StatusBadRequest)
		return
	}

	// Get database handle for analytics data (contains the logs)
	db, err := database.GetAnalyticsDB()
	if err != nil {
		log.Printf("Error getting analytics database handle for logs: %v", err)
		http.Error(w, "Server configuration error (database)", http.StatusInternalServerError)
		return
	}
	// Optional: Add check if db.UserAnalyticsCollection is nil if needed

	switch r.Method {
	case http.MethodGet:
		getLogsData(w, r, userID, db) // Pass db handle
	default:
		w.Header().Set("Allow", "GET")
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// getLogsData handles GET requests to fetch user query logs.
func getLogsData(w http.ResponseWriter, r *http.Request, userID string, db *database.Analytics_DB) {
	log.Printf("GET /logs/%s", userID)
	var userAnalytics database.UserAnalytics

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	// Fetch the document containing the domain lists
	err := db.UserAnalyticsCollection.FindOne(ctx, filter).Decode(&userAnalytics)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("No analytics/log data found for userID %s, returning empty list.", userID)
			// Return an empty JSON array
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK) // Important to send 200 OK with empty list
			json.NewEncoder(w).Encode([]LogEntryResponse{})
			return
		}
		log.Printf("Error fetching analytics/log data for userID %s from DB: %v", userID, err)
		http.Error(w, "Failed to retrieve log data", http.StatusInternalServerError)
		return
	}

	// --- Process Data: Combine Passed and Dropped into a single log list ---
	var logEntries []LogEntryResponse

	// Add passed domains
	for _, entry := range userAnalytics.PassedDomains {
		logEntries = append(logEntries, LogEntryResponse{
			Domain:    entry.Domain,
			Timestamp: entry.Timestamp,
			Status:    "allowed",
		})
	}

	// Add dropped domains
	for _, entry := range userAnalytics.DroppedDomains {
		logEntries = append(logEntries, LogEntryResponse{
			Domain:    entry.Domain,
			Timestamp: entry.Timestamp,
			Status:    "blocked",
		})
	}

	// Sort combined list by timestamp descending (most recent first)
	sort.Slice(logEntries, func(i, j int) bool {
		return logEntries[i].Timestamp.After(logEntries[j].Timestamp)
	})

	// --- Send Response ---
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(logEntries); err != nil {
		log.Printf("Error encoding logs response for userID %s: %v", userID, err)
		// Avoid writing header again if already written by http.Error
	}
}
