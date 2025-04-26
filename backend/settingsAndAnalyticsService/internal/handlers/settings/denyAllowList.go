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

// DenyAllowListSettings defines the structure for the document in the DenyAllowList collection.
// It holds both denied and allowed domains for a user.
type DenyAllowListSettings struct {
	UserID         string   `json:"userId" bson:"userId"`
	DeniedDomains  []string `json:"deniedDomains,omitempty" bson:"deniedDomains,omitempty"`
	AllowedDomains []string `json:"allowedDomains,omitempty" bson:"allowedDomains,omitempty"`
}

// DenyListResponse defines the structure for the deny list GET response.
type DenyListResponse struct {
	UserID  string   `json:"userId"`
	Domains []string `json:"domains"`
}

// AllowListResponse defines the structure for the allow list GET response.
type AllowListResponse struct {
	UserID  string   `json:"userId"`
	Domains []string `json:"domains"`
}

// AddDomainRequest defines the structure for the add domain request body.
type AddDomainRequest struct {
	Domain string `json:"domain"`
}

// RemoveDomainRequest defines the structure for the remove domain request body.
type RemoveDomainRequest struct {
	Domain string `json:"domain"`
}

// --- Deny List Handlers ---

// DenyListHandler routes requests for deny list settings (/settings/denylist/{userID}).
func DenyListHandler(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 3 || pathParts[0] != "settings" || pathParts[1] != "denylist" {
		http.Error(w, "Invalid path format. Expected /settings/denylist/{userID}", http.StatusBadRequest)
		return
	}
	userID := pathParts[2]
	if userID == "" {
		http.Error(w, "User ID cannot be empty", http.StatusBadRequest)
		return
	}

	db, err := database.GetSettingsDB()
	if err != nil {
		log.Printf("Error getting database handle: %v", err)
		http.Error(w, "Server configuration error (database)", http.StatusInternalServerError)
		return
	}
	// *** IMPORTANT: Ensure db.DenyAllowList is initialized in your database package ***
	if db.DenyAllowList == nil {
		log.Println("Error: DenyAllowList MongoDB collection is not initialized.")
		http.Error(w, "Server configuration error (collection)", http.StatusInternalServerError)
		return
	}

	collection := db.DenyAllowList // Use the single collection

	switch r.Method {
	case http.MethodGet:
		getDenyList(w, r, userID, collection)
	case http.MethodPost:
		addDenyDomain(w, r, userID, collection)
	case http.MethodDelete: // Add DELETE method handler
		removeDenyDomain(w, r, userID, collection)
	default:
		w.Header().Set("Allow", "GET, POST, DELETE") // Update Allow header
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// getDenyList handles GET requests to fetch the user's deny list.
func getDenyList(w http.ResponseWriter, r *http.Request, userID string, collection *mongo.Collection) {
	log.Printf("GET /settings/denylist/%s", userID)
	var settings DenyAllowListSettings                                // Fetch the combined settings document
	response := DenyListResponse{UserID: userID, Domains: []string{}} // Default to empty list

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	// Only retrieve the deniedDomains field to be more efficient
	opts := options.FindOne().SetProjection(bson.M{"deniedDomains": 1})
	err := collection.FindOne(ctx, filter, opts).Decode(&settings)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("No deny/allow list document found for userID %s, returning empty deny list.", userID)
			// Response already defaults to empty, do nothing
		} else {
			log.Printf("Error fetching deny list for userID %s from DB: %v", userID, err)
			http.Error(w, "Failed to retrieve deny list", http.StatusInternalServerError)
			return
		}
	} else {
		// If document found and DeniedDomains is not nil, use it
		if settings.DeniedDomains != nil {
			response.Domains = settings.DeniedDomains
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding deny list response for userID %s: %v", userID, err)
	}
}

// addDenyDomain handles POST requests to add a domain to the user's deny list.
func addDenyDomain(w http.ResponseWriter, r *http.Request, userID string, collection *mongo.Collection) {
	log.Printf("POST /settings/denylist/%s", userID)
	var req AddDomainRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding add deny domain request body for userID %s: %v", userID, err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	domainToAdd := strings.TrimSpace(req.Domain)
	if domainToAdd == "" {
		http.Error(w, "Domain cannot be empty", http.StatusBadRequest)
		return
	}
	// Add more robust domain validation if needed

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	// Use $addToSet on the 'deniedDomains' field
	update := bson.M{
		"$addToSet":    bson.M{"deniedDomains": domainToAdd},
		"$setOnInsert": bson.M{"userId": userID}, // Set userId only if inserting a new document
	}
	opts := options.Update().SetUpsert(true) // Create the document if it doesn't exist

	result, err := collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		log.Printf("Error adding deny domain '%s' for userID %s in DB: %v", domainToAdd, userID, err)
		http.Error(w, "Failed to update deny list", http.StatusInternalServerError)
		return
	}

	if result.UpsertedCount > 0 {
		log.Printf("Created deny/allow list document and added domain '%s' to deny list for userID %s", domainToAdd, userID)
	} else if result.ModifiedCount > 0 {
		log.Printf("Added domain '%s' to deny list for userID %s", domainToAdd, userID)
	} else {
		log.Printf("Domain '%s' was already in the deny list for userID %s.", domainToAdd, userID)
	}

	log.Printf("Successfully processed add deny domain request for userID %s, domain '%s'", userID, domainToAdd)
	w.WriteHeader(http.StatusNoContent) // Indicate success with no content to return
}

// removeDenyDomain handles DELETE requests to remove a domain from the user's deny list.
func removeDenyDomain(w http.ResponseWriter, r *http.Request, userID string, collection *mongo.Collection) {
	log.Printf("DELETE /settings/denylist/%s", userID)
	var req RemoveDomainRequest

	// For DELETE, the domain might be in the query params or request body.
	// Let's assume request body for consistency with POST.
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding remove deny domain request body for userID %s: %v", userID, err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	domainToRemove := strings.TrimSpace(req.Domain)
	if domainToRemove == "" {
		http.Error(w, "Domain cannot be empty", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	// Use $pull to remove the domain from the 'deniedDomains' array
	update := bson.M{
		"$pull": bson.M{"deniedDomains": domainToRemove},
	}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error removing deny domain '%s' for userID %s from DB: %v", domainToRemove, userID, err)
		http.Error(w, "Failed to update deny list", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		log.Printf("No deny/allow list document found for userID %s, cannot remove domain.", userID)
		// Or you could return 404 Not Found
		http.Error(w, "User settings not found", http.StatusNotFound)
		return
	}

	if result.ModifiedCount > 0 {
		log.Printf("Removed domain '%s' from deny list for userID %s", domainToRemove, userID)
	} else {
		log.Printf("Domain '%s' was not found in the deny list for userID %s.", domainToRemove, userID)
		// It's often okay to return success even if the item wasn't there (idempotent DELETE)
	}

	log.Printf("Successfully processed remove deny domain request for userID %s, domain '%s'", userID, domainToRemove)
	w.WriteHeader(http.StatusNoContent) // Indicate success with no content to return
}

// --- Allow List Handlers ---

// AllowListHandler routes requests for allow list settings (/settings/allowlist/{userID}).
func AllowListHandler(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 3 || pathParts[0] != "settings" || pathParts[1] != "allowlist" {
		http.Error(w, "Invalid path format. Expected /settings/allowlist/{userID}", http.StatusBadRequest)
		return
	}
	userID := pathParts[2]
	if userID == "" {
		http.Error(w, "User ID cannot be empty", http.StatusBadRequest)
		return
	}

	db, err := database.GetSettingsDB()
	if err != nil {
		log.Printf("Error getting database handle: %v", err)
		http.Error(w, "Server configuration error (database)", http.StatusInternalServerError)
		return
	}
	// *** IMPORTANT: Ensure db.DenyAllowList is initialized in your database package ***
	if db.DenyAllowList == nil {
		log.Println("Error: DenyAllowList MongoDB collection is not initialized.")
		http.Error(w, "Server configuration error (collection)", http.StatusInternalServerError)
		return
	}

	collection := db.DenyAllowList // Use the single collection

	switch r.Method {
	case http.MethodGet:
		getAllowList(w, r, userID, collection)
	case http.MethodPost:
		addAllowDomain(w, r, userID, collection)
	case http.MethodDelete: // Add DELETE method handler
		removeAllowDomain(w, r, userID, collection)
	default:
		w.Header().Set("Allow", "GET, POST, DELETE") // Update Allow header
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// getAllowList handles GET requests to fetch the user's allow list.
func getAllowList(w http.ResponseWriter, r *http.Request, userID string, collection *mongo.Collection) {
	log.Printf("GET /settings/allowlist/%s", userID)
	var settings DenyAllowListSettings                                 // Fetch the combined settings document
	response := AllowListResponse{UserID: userID, Domains: []string{}} // Default to empty list

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	// Only retrieve the allowedDomains field to be more efficient
	opts := options.FindOne().SetProjection(bson.M{"allowedDomains": 1})
	err := collection.FindOne(ctx, filter, opts).Decode(&settings)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("No deny/allow list document found for userID %s, returning empty allow list.", userID)
			// Response already defaults to empty, do nothing
		} else {
			log.Printf("Error fetching allow list for userID %s from DB: %v", userID, err)
			http.Error(w, "Failed to retrieve allow list", http.StatusInternalServerError)
			return
		}
	} else {
		// If document found and AllowedDomains is not nil, use it
		if settings.AllowedDomains != nil {
			response.Domains = settings.AllowedDomains
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding allow list response for userID %s: %v", userID, err)
	}
}

// addAllowDomain handles POST requests to add a domain to the user's allow list.
func addAllowDomain(w http.ResponseWriter, r *http.Request, userID string, collection *mongo.Collection) {
	log.Printf("POST /settings/allowlist/%s", userID)
	var req AddDomainRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding add allow domain request body for userID %s: %v", userID, err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	domainToAdd := strings.TrimSpace(req.Domain)
	if domainToAdd == "" {
		http.Error(w, "Domain cannot be empty", http.StatusBadRequest)
		return
	}
	// Add more robust domain validation if needed

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	// Use $addToSet on the 'allowedDomains' field
	update := bson.M{
		"$addToSet":    bson.M{"allowedDomains": domainToAdd},
		"$setOnInsert": bson.M{"userId": userID}, // Set userId only if inserting a new document
	}
	opts := options.Update().SetUpsert(true) // Create the document if it doesn't exist

	result, err := collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		log.Printf("Error adding allow domain '%s' for userID %s in DB: %v", domainToAdd, userID, err)
		http.Error(w, "Failed to update allow list", http.StatusInternalServerError)
		return
	}

	if result.UpsertedCount > 0 {
		log.Printf("Created deny/allow list document and added domain '%s' to allow list for userID %s", domainToAdd, userID)
	} else if result.ModifiedCount > 0 {
		log.Printf("Added domain '%s' to allow list for userID %s", domainToAdd, userID)
	} else {
		log.Printf("Domain '%s' was already in the allow list for userID %s.", domainToAdd, userID)
	}

	log.Printf("Successfully processed add allow domain request for userID %s, domain '%s'", userID, domainToAdd)
	w.WriteHeader(http.StatusNoContent) // Indicate success with no content to return
}

// removeAllowDomain handles DELETE requests to remove a domain from the user's allow list.
func removeAllowDomain(w http.ResponseWriter, r *http.Request, userID string, collection *mongo.Collection) {
	log.Printf("DELETE /settings/allowlist/%s", userID)
	var req RemoveDomainRequest

	// Assume request body for consistency
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding remove allow domain request body for userID %s: %v", userID, err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	domainToRemove := strings.TrimSpace(req.Domain)
	if domainToRemove == "" {
		http.Error(w, "Domain cannot be empty", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	// Use $pull to remove the domain from the 'allowedDomains' array
	update := bson.M{
		"$pull": bson.M{"allowedDomains": domainToRemove},
	}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error removing allow domain '%s' for userID %s from DB: %v", domainToRemove, userID, err)
		http.Error(w, "Failed to update allow list", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		log.Printf("No deny/allow list document found for userID %s, cannot remove domain.", userID)
		http.Error(w, "User settings not found", http.StatusNotFound)
		return
	}

	if result.ModifiedCount > 0 {
		log.Printf("Removed domain '%s' from allow list for userID %s", domainToRemove, userID)
	} else {
		log.Printf("Domain '%s' was not found in the allow list for userID %s.", domainToRemove, userID)
	}

	log.Printf("Successfully processed remove allow domain request for userID %s, domain '%s'", userID, domainToRemove)
	w.WriteHeader(http.StatusNoContent) // Indicate success with no content to return
}
