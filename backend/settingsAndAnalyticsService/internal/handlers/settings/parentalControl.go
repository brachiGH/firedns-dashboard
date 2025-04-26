package settings

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/BrachiGH/firedns-dashboard/internal/database" // Assuming this is your database package
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// TimeRange defines the start and end time for recreation periods.
type TimeRange struct {
	Start string `json:"start" bson:"start"` // e.g., "12:00 PM"
	End   string `json:"end"   bson:"end"`   // e.g., "6:30 PM"
}

// ParentalControlSettings defines the structure for parental control settings.
type ParentalControlSettings struct {
	UserID             string               `json:"userId" bson:"userId"`
	BlockedApps        map[string]bool      `json:"blockedApps" bson:"blockedApps"`               // Map of app/service name to blocked status
	RecreationSchedule map[string]TimeRange `json:"recreationSchedule" bson:"recreationSchedule"` // Map of day ("Monday", "Tuesday", etc.) to TimeRange
}

// defaultParentalControlSettings returns a ParentalControlSettings struct with default values.
func defaultParentalControlSettings(userID string) ParentalControlSettings {
	// Initialize with common apps/services, all unblocked by default
	defaultBlockedApps := map[string]bool{
		"TikTok":              false,
		"Tinder":              false,
		"Snapchat":            false,
		"Instagram":           false,
		"Facebook":            false,
		"Twitter":             false,
		"VK":                  false,
		"Roblox":              false,
		"Tumblr":              false,
		"Fortnite":            false,
		"YouTube":             false,
		"Twitch":              false,
		"Reddit":              false,
		"Messenger":           false,
		"League of Legends":   false,
		"Telegram":            false,
		"Discord":             false,
		"Minecraft":           false,
		"Pinterest":           false,
		"BeReal":              false,
		"Hulu":                false,
		"Steam":               false,
		"Netflix":             false,
		"WhatsApp":            false,
		"PlayStation Network": false,
		"Mastodon":            false,
		"eBay":                false,
		"HBO Max":             false,
		"Signal":              false,
		"Spotify":             false,
		"Zoom":                false,
		"Amazon":              false,
		"ChatGPT":             false,
		// Add other relevant apps/services here
	}

	// Default recreation schedule (e.g., 12:00 PM to 6:30 PM weekdays, different weekends)
	defaultSchedule := map[string]TimeRange{
		"Monday":    {Start: "12:00 PM", End: "6:30 PM"},
		"Tuesday":   {Start: "12:00 PM", End: "6:30 PM"},
		"Wednesday": {Start: "12:00 PM", End: "6:30 PM"},
		"Thursday":  {Start: "12:00 PM", End: "6:30 PM"},
		"Friday":    {Start: "12:00 PM", End: "6:30 PM"},
		"Saturday":  {Start: "12:00 PM", End: "9:30 PM"}, // Example different weekend time
		"Sunday":    {Start: "12:00 PM", End: "9:30 PM"}, // Example different weekend time
	}

	return ParentalControlSettings{
		UserID:             userID,
		BlockedApps:        defaultBlockedApps,
		RecreationSchedule: defaultSchedule,
	}
}

// ParentalControlHandler routes requests for parental control settings based on HTTP method.
func ParentalControlHandler(w http.ResponseWriter, r *http.Request) {
	// Extract userID from path, e.g., /settings/parental/user123
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 3 || pathParts[0] != "settings" || pathParts[1] != "parental" {
		http.Error(w, "Invalid path format. Expected /settings/parental/{userID}", http.StatusBadRequest)
		return
	}
	userID := pathParts[2]
	if userID == "" {
		http.Error(w, "User ID cannot be empty", http.StatusBadRequest)
		return
	}

	// Get database handle
	db, err := database.GetSettingsDB()
	if err != nil {
		log.Printf("Error getting database handle: %v", err)
		http.Error(w, "Server configuration error (database)", http.StatusInternalServerError)
		return
	}
	// *** IMPORTANT: Ensure db.ParentalControl collection exists and is initialized in your database package ***
	// Example check (adjust based on your database package structure):
	// if db.ParentalControl == nil {
	//  log.Println("Error: Parental Control MongoDB collection is not initialized.")
	//  http.Error(w, "Server configuration error (collection)", http.StatusInternalServerError)
	//  return
	// }

	switch r.Method {
	case http.MethodGet:
		getParentalControlSettings(w, r, userID, db) // Pass db handle
	case http.MethodPatch:
		updateParentalControlSettings(w, r, userID, db) // Pass db handle
	default:
		w.Header().Set("Allow", "GET, PATCH")
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// getParentalControlSettings handles GET requests to fetch user parental control settings.
func getParentalControlSettings(w http.ResponseWriter, r *http.Request, userID string, db *database.UserSettings_DB) { // Accept db handle
	log.Printf("GET /settings/parental/%s", userID)
	var settings ParentalControlSettings

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	// *** IMPORTANT: Use the correct collection handle from your db struct (e.g., db.ParentalControl) ***
	err := db.Parental.FindOne(ctx, filter).Decode(&settings) // Replace 'ParentalControl' if needed

	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("No parental control settings found for userID %s, returning defaults.", userID)
			settings = defaultParentalControlSettings(userID)
			// Proceed to send default settings
		} else {
			log.Printf("Error fetching parental control settings for userID %s from DB: %v", userID, err)
			http.Error(w, "Failed to retrieve parental control settings", http.StatusInternalServerError)
			return
		}
	}

	// Ensure all default apps are present in the response, even if not stored in DB yet
	// This handles cases where new apps are added to the defaults later.
	defaultSettings := defaultParentalControlSettings(userID)
	if settings.BlockedApps == nil {
		settings.BlockedApps = defaultSettings.BlockedApps
	} else {
		for app, blocked := range defaultSettings.BlockedApps {
			if _, exists := settings.BlockedApps[app]; !exists {
				settings.BlockedApps[app] = blocked // Add missing default app with default status
			}
		}
	}
	if settings.RecreationSchedule == nil {
		settings.RecreationSchedule = defaultSettings.RecreationSchedule
	} else {
		// Ensure all days are present
		for day, timeRange := range defaultSettings.RecreationSchedule {
			if _, exists := settings.RecreationSchedule[day]; !exists {
				settings.RecreationSchedule[day] = timeRange
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(settings); err != nil {
		log.Printf("Error encoding parental control settings response for userID %s: %v", userID, err)
		// Avoid writing header again if already written by http.Error
	}
}

// updateParentalControlSettings handles PATCH requests to update user parental control settings.
func updateParentalControlSettings(w http.ResponseWriter, r *http.Request, userID string, db *database.UserSettings_DB) { // Accept db handle
	log.Printf("PATCH /settings/parental/%s", userID)
	var updatedSettings ParentalControlSettings

	if err := json.NewDecoder(r.Body).Decode(&updatedSettings); err != nil {
		log.Printf("Error decoding parental control request body for userID %s: %v", userID, err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Ensure the settings we save have the correct UserID from the path
	updatedSettings.UserID = userID

	// Basic validation (optional but recommended)
	if updatedSettings.BlockedApps == nil {
		log.Printf("Warning: Received PATCH request for userID %s with nil BlockedApps", userID)
		// Decide how to handle: reject, use defaults, or proceed? Here we proceed.
		// updatedSettings.BlockedApps = defaultParentalControlSettings(userID).BlockedApps // Option: Reset to defaults
	}
	if updatedSettings.RecreationSchedule == nil {
		log.Printf("Warning: Received PATCH request for userID %s with nil RecreationSchedule", userID)
		// updatedSettings.RecreationSchedule = defaultParentalControlSettings(userID).RecreationSchedule // Option: Reset to defaults
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second) // Increased timeout slightly for potentially larger updates
	defer cancel()

	filter := bson.M{"userId": userID}
	// Create the update document carefully to avoid overwriting entire maps if only parts are sent
	updateFields := bson.M{}
	if updatedSettings.BlockedApps != nil {
		// To update specific keys within the map, iterate or use dot notation if possible
		// Simple approach: replace the whole map (assumes frontend sends the complete map)
		updateFields["blockedApps"] = updatedSettings.BlockedApps
	}
	if updatedSettings.RecreationSchedule != nil {
		// Simple approach: replace the whole map
		updateFields["recreationSchedule"] = updatedSettings.RecreationSchedule
	}

	if len(updateFields) == 0 {
		log.Printf("No fields to update for parental control settings for userID %s", userID)
		w.WriteHeader(http.StatusOK) // Or http.StatusNoContent
		json.NewEncoder(w).Encode(map[string]string{"message": "No changes detected"})
		return
	}

	update := bson.M{"$set": updateFields}
	opts := options.Update().SetUpsert(true)

	// *** IMPORTANT: Use the correct collection handle from your db struct (e.g., db.ParentalControl) ***
	result, err := db.Parental.UpdateOne(ctx, filter, update, opts) // Replace 'ParentalControl' if needed
	if err != nil {
		log.Printf("Error updating/inserting parental control settings for userID %s in DB: %v", userID, err)
		http.Error(w, "Failed to update parental control settings", http.StatusInternalServerError)
		return
	}

	if result.UpsertedCount > 0 {
		log.Printf("Inserted new parental control settings for userID %s", userID)
	} else if result.ModifiedCount > 0 {
		log.Printf("Updated existing parental control settings for userID %s", userID)
	} else {
		log.Printf("Parental control settings for userID %s were already up-to-date.", userID)
	}

	log.Printf("Successfully updated parental control settings for userID %s", userID)

	// Fetch the potentially merged/updated settings to return the full current state
	var finalSettings ParentalControlSettings
	err = db.Parental.FindOne(ctx, filter).Decode(&finalSettings)
	if err != nil {
		log.Printf("Error fetching updated parental control settings for userID %s after update: %v", userID, err)
		// Still return success, but maybe log the inconsistency or return the input data
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(updatedSettings) // Return the input as fallback
		return
	}

	// Merge defaults back in case some apps were missing from the stored doc before GET merge logic runs
	defaultSettings := defaultParentalControlSettings(userID)
	if finalSettings.BlockedApps == nil {
		finalSettings.BlockedApps = defaultSettings.BlockedApps
	} else {
		for app, blocked := range defaultSettings.BlockedApps {
			if _, exists := finalSettings.BlockedApps[app]; !exists {
				finalSettings.BlockedApps[app] = blocked
			}
		}
	}
	if finalSettings.RecreationSchedule == nil {
		finalSettings.RecreationSchedule = defaultSettings.RecreationSchedule
	} else {
		for day, timeRange := range defaultSettings.RecreationSchedule {
			if _, exists := finalSettings.RecreationSchedule[day]; !exists {
				finalSettings.RecreationSchedule[day] = timeRange
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // Set status before writing body
	if err := json.NewEncoder(w).Encode(finalSettings); err != nil {
		log.Printf("Error encoding parental control update response for userID %s: %v", userID, err)
	}
}
