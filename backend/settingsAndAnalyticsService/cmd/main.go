package main

import (
	"time"

	"github.com/BrachiGH/firedns-dashboard/internal/database"
	"github.com/BrachiGH/firedns-dashboard/internal/services/user/etl"
	"github.com/BrachiGH/firedns-dashboard/transport"
	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

func main() {
	var log *zap.Logger

	// Load .env file. Handle error if it doesn't exist or can't be read.
	err := godotenv.Load()
	if err != nil {
		log.Info("Warning: Could not load .env file. Using default or existing environment variables.")
	}

	// Connect to Analytics MongoDB
	analyticsDB := &database.Analytics_DB{}
	if err := analyticsDB.Connect(); err != nil {
		log.Fatal("Failed to connect to Analytics MongoDB: %v", zap.Error(err))
	}
	defer analyticsDB.Disconnect()

	// Connect to UserSettings MongoDB
	settingsDB := &database.UserSettings_DB{}
	if err := settingsDB.Connect(); err != nil {
		log.Fatal("Failed to connect to Analytics MongoDB: %v", zap.Error(err))
	}
	defer settingsDB.Disconnect()

	// Connect to PostgreSQL
	_, err = database.ConnectPG()
	if err != nil {
		log.Fatal("Failed to connect to PostgreSQL: %v", zap.Error(err))
	}
	defer database.ClosePG() // Ensure disconnection on shutdown

	// Launch api services
	go transport.StartApiServer()

	// Start the ETL routine (e.g., run every 5 minutes)
	go etl.StartETLRoutine(24 * time.Hour)

	select {}
}
