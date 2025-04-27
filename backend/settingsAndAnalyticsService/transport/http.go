package transport

import (
	"log"
	"net/http"
	"os"

	"github.com/BrachiGH/firedns-dashboard/internal/handlers/analytics"
	"github.com/BrachiGH/firedns-dashboard/internal/handlers/settings"
)

func StartApiServer() {
	http.HandleFunc("/settings/general/", settings.GeneralSettingsHandler)
	http.HandleFunc("/settings/privacy/", settings.PrivacySettingsHandler)
	http.HandleFunc("/settings/parental/", settings.ParentalControlHandler)
	http.HandleFunc("/settings/denylist/", settings.DenyListHandler)
	http.HandleFunc("/settings/allowlist/", settings.AllowListHandler)
	http.HandleFunc("/analytics/", analytics.AnalyticsHandler)
	http.HandleFunc("/logs/", analytics.LogsHandler)

	port := ":8080"

	// Start the HTTP server
	log.Printf("Starting server on %s", port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		if _, ok := err.(*os.PathError); ok {
			log.Fatalf("Server failed to start: Error: %v", err)
		} else {
			log.Fatalf("Server failed to start: %v", err)
		}
	}
}
