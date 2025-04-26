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

// PrivacySettings defines the structure for user privacy blocklist settings.
type PrivacySettings struct {
	UserID                 string `json:"userId" bson:"userId"`
	AdGuardMobileAdsFilter bool   `json:"adGuardMobileAdsFilter" bson:"adGuardMobileAdsFilter"`
	AdAway                 bool   `json:"adAway" bson:"adAway"`
	HageziMultiPro         bool   `json:"hageziMultiPro" bson:"hageziMultiPro"` // Simplified name for struct field
	GoodbyeAds             bool   `json:"goodbyeAds" bson:"goodbyeAds"`
	HostsVN                bool   `json:"hostsVN" bson:"hostsVN"`
	NextDNSAdsTrackers     bool   `json:"nextDNSAdsTrackers" bson:"nextDNSAdsTrackers"` // Simplified name
}

// defaultPrivacySettings returns a PrivacySettings struct with all blocklists disabled.
func defaultPrivacySettings(userID string) PrivacySettings {
	return PrivacySettings{
		UserID:                 userID,
		AdGuardMobileAdsFilter: false,
		AdAway:                 false,
		HageziMultiPro:         false,
		GoodbyeAds:             false,
		HostsVN:                false,
		NextDNSAdsTrackers:     false,
	}
}

// PrivacySettingsHandler routes requests for privacy settings based on HTTP method.
func PrivacySettingsHandler(w http.ResponseWriter, r *http.Request) {
	// Extract userID from path, e.g., /settings/privacy/user123
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 3 || pathParts[0] != "settings" || pathParts[1] != "privacy" {
		http.Error(w, "Invalid path format. Expected /settings/privacy/{userID}", http.StatusBadRequest)
		return
	}
	userID := pathParts[2]
	if userID == "" {
		http.Error(w, "User ID cannot be empty", http.StatusBadRequest)
		return
	}

	// Get database handle (assuming GetSettingsDB provides access to the privacy collection)
	db, err := database.GetSettingsDB()
	// *** IMPORTANT: Adjust this check based on how your database package exposes the privacy collection ***
	// Example: if db.Privacy == nil || err != nil {
	if err != nil { // Basic check if GetSettingsDB itself failed
		log.Printf("Error getting database handle: %v", err)
		http.Error(w, "Server configuration error (database)", http.StatusInternalServerError)
		return
	}
	// Add a specific check if the collection handle could be nil
	// if db.Privacy == nil {
	//  log.Println("Error: Privacy Settings MongoDB collection is not initialized.")
	//  http.Error(w, "Server configuration error (collection)", http.StatusInternalServerError)
	//  return
	// }

	switch r.Method {
	case http.MethodGet:
		getPrivacySettings(w, r, userID, db) // Pass db handle
	case http.MethodPatch:
		updatePrivacySettings(w, r, userID, db) // Pass db handle
	default:
		w.Header().Set("Allow", "GET, PATCH")
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// getPrivacySettings handles GET requests to fetch user privacy settings.
func getPrivacySettings(w http.ResponseWriter, r *http.Request, userID string, db *database.UserSettings_DB) { // Accept db handle
	log.Printf("GET /settings/privacy/%s", userID)
	var settings PrivacySettings

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	// *** IMPORTANT: Use the correct collection handle from your db struct ***
	// Example: err := db.Privacy.FindOne(ctx, filter).Decode(&settings)
	// Using a placeholder name 'Privacy' - replace with your actual collection field name
	err := db.Privacy.FindOne(ctx, filter).Decode(&settings)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("No privacy settings found for userID %s, returning defaults.", userID)
			settings = defaultPrivacySettings(userID)
			// Proceed to send default settings
		} else {
			log.Printf("Error fetching privacy settings for userID %s from DB: %v", userID, err)
			http.Error(w, "Failed to retrieve privacy settings", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(settings); err != nil {
		log.Printf("Error encoding privacy settings response for userID %s: %v", userID, err)
		// Avoid writing header again if already written by http.Error
	}
}

// updatePrivacySettings handles PATCH requests to update user privacy settings.
func updatePrivacySettings(w http.ResponseWriter, r *http.Request, userID string, db *database.UserSettings_DB) { // Accept db handle
	log.Printf("PATCH /settings/privacy/%s", userID)
	var updatedSettings PrivacySettings

	if err := json.NewDecoder(r.Body).Decode(&updatedSettings); err != nil {
		log.Printf("Error decoding privacy request body for userID %s: %v", userID, err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Ensure the settings we save have the correct UserID from the path
	updatedSettings.UserID = userID

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	update := bson.M{
		"$set": bson.M{
			"adGuardMobileAdsFilter": updatedSettings.AdGuardMobileAdsFilter,
			"adAway":                 updatedSettings.AdAway,
			"hageziMultiPro":         updatedSettings.HageziMultiPro,
			"goodbyeAds":             updatedSettings.GoodbyeAds,
			"hostsVN":                updatedSettings.HostsVN,
			"nextDNSAdsTrackers":     updatedSettings.NextDNSAdsTrackers,
			// userId is in the filter, not in the $set
		},
	}
	opts := options.Update().SetUpsert(true)

	// *** IMPORTANT: Use the correct collection handle from your db struct ***
	// Example: result, err := db.Privacy.UpdateOne(ctx, filter, update, opts)
	// Using a placeholder name 'Privacy' - replace with your actual collection field name
	result, err := db.Privacy.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		log.Printf("Error updating/inserting privacy settings for userID %s in DB: %v", userID, err)
		http.Error(w, "Failed to update privacy settings", http.StatusInternalServerError)
		return
	}

	if result.UpsertedCount > 0 {
		log.Printf("Inserted new privacy settings for userID %s", userID)
	} else if result.ModifiedCount > 0 {
		log.Printf("Updated existing privacy settings for userID %s", userID)
	} else {
		log.Printf("Privacy settings for userID %s were already up-to-date.", userID)
	}

	log.Printf("Successfully updated privacy settings for userID %s", userID)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // Set status before writing body
	if err := json.NewEncoder(w).Encode(updatedSettings); err != nil {
		log.Printf("Error encoding privacy update response for userID %s: %v", userID, err)
	}
}
