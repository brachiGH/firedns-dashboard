package settings

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/BrachiGH/firedns-dashboard/internal/database"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type GeneralSettings struct {
	UserID                  string `json:"userId" bson:"userId"`
	ThreatIntelligence      bool   `json:"threatIntelligence" bson:"threatIntelligence"`
	GoogleSafeBrowsing      bool   `json:"googleSafeBrowsing" bson:"googleSafeBrowsing"`
	HomographProtection     bool   `json:"homographProtection" bson:"homographProtection"`
	TyposquattingProtection bool   `json:"typosquattingProtection" bson:"typosquattingProtection"`
	BlockNewDomains         bool   `json:"blockNewDomains" bson:"blockNewDomains"`
	BlockDynamicDNS         bool   `json:"blockDynamicDNS" bson:"blockDynamicDNS"`
	BlockCSAM               bool   `json:"blockCSAM" bson:"blockCSAM"`
}

func defaultGeneralSettings(userID string) GeneralSettings {
	return GeneralSettings{
		UserID:                  userID,
		ThreatIntelligence:      false,
		GoogleSafeBrowsing:      false,
		HomographProtection:     false,
		TyposquattingProtection: false,
		BlockNewDomains:         false,
		BlockDynamicDNS:         false,
		BlockCSAM:               false,
	}
}

func GeneralSettingsHandler(w http.ResponseWriter, r *http.Request) {
	// Extract userID from path, e.g., /settings/general/user123
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 3 || pathParts[0] != "settings" || pathParts[1] != "general" {
		http.Error(w, "Invalid path format. Expected /settings/general/{userID}", http.StatusBadRequest)
		return
	}
	userID := pathParts[2]
	if userID == "" {
		http.Error(w, "User ID cannot be empty", http.StatusBadRequest)
		return
	}

	// Placeholder check for MongoDB collection initialization
	db, err := database.GetSettingsDB()
	if db.General == nil || err != nil {
		log.Println("Error: Settings MongoDB collection is not initialized.")
		http.Error(w, "Server configuration error", http.StatusInternalServerError)
		return
	}

	switch r.Method {
	case http.MethodGet:
		getGeneralSettings(w, r, userID)
	case http.MethodPatch: // Using PATCH for updates
		updateGeneralSettings(w, r, userID)
	default:
		w.Header().Set("Allow", "GET, PATCH")
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getGeneralSettings(w http.ResponseWriter, r *http.Request, userID string) {
	log.Printf("GET /settings/general/%s", userID)
	var settings GeneralSettings

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second) // Use request context with timeout
	defer cancel()

	filter := bson.M{"userId": userID}
	db, _ := database.GetSettingsDB()
	err := db.General.FindOne(ctx, filter).Decode(&settings)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			// No settings found for this user, return defaults
			log.Printf("No settings found for userID %s, returning defaults.", userID)
			settings = defaultGeneralSettings(userID)
			// No need to return error here, just proceed to send default settings
		} else {
			// Other database error
			log.Printf("Error fetching settings for userID %s from DB: %v", userID, err)
			http.Error(w, "Failed to retrieve settings", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(settings); err != nil {
		log.Printf("Error encoding settings response for userID %s: %v", userID, err)
	}
}

func updateGeneralSettings(w http.ResponseWriter, r *http.Request, userID string) {
	log.Printf("PATCH /settings/general/%s", userID)
	var updatedSettings GeneralSettings

	// Decode the request body
	if err := json.NewDecoder(r.Body).Decode(&updatedSettings); err != nil {
		log.Printf("Error decoding request body for userID %s: %v", userID, err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Ensure the userID from the path matches the one potentially in the body (optional, but good practice)
	if updatedSettings.UserID != "" && updatedSettings.UserID != userID {
		http.Error(w, "User ID in path does not match user ID in body", http.StatusBadRequest)
		return
	}
	// Ensure the settings we save have the correct UserID from the path
	updatedSettings.UserID = userID

	// --- MongoDB Update/Upsert Logic Placeholder ---
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second) // Use request context with timeout
	defer cancel()

	filter := bson.M{"userId": userID}
	// Use bson.M for flexibility or bson.D for ordered elements if needed
	update := bson.M{
		"$set": bson.M{
			"threatIntelligence":      updatedSettings.ThreatIntelligence,
			"googleSafeBrowsing":      updatedSettings.GoogleSafeBrowsing,
			"homographProtection":     updatedSettings.HomographProtection,
			"typosquattingProtection": updatedSettings.TyposquattingProtection,
			"blockNewDomains":         updatedSettings.BlockNewDomains,
			"blockDynamicDNS":         updatedSettings.BlockDynamicDNS,
			"blockCSAM":               updatedSettings.BlockCSAM,
			// Note: We don't $set the userId itself here, it's used in the filter
		},
	}
	fmt.Println(update)
	opts := options.Update().SetUpsert(true) // Upsert: update if exists, insert if not

	db, _ := database.GetSettingsDB()
	result, err := db.General.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		log.Printf("Error updating/inserting settings for userID %s in DB: %v", userID, err)
		http.Error(w, "Failed to update settings", http.StatusInternalServerError)
		return
	}

	if result.UpsertedCount > 0 {
		log.Printf("Inserted new settings for userID %s", userID)
	} else if result.ModifiedCount > 0 {
		log.Printf("Updated existing settings for userID %s", userID)
	} else {
		log.Printf("Settings for userID %s were already up-to-date.", userID) // This happens if the submitted data is identical to existing data
	}
	// --- End MongoDB Update/Upsert Logic Placeholder ---

	log.Printf("Successfully updated settings for userID %s", userID)
	w.WriteHeader(http.StatusOK) // Or http.StatusNoContent if you don't return a body
	// Optionally return the updated settings
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(updatedSettings); err != nil {
		log.Printf("Error encoding update response for userID %s: %v", userID, err)
	}
}
