package main

import (
	"github.com/BrachiGH/firedns-dashboard/internal/database"
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

	// Connect to databases
	var a_db database.Analytics_DB
	err = a_db.Connect()
	if err != nil {
		log.Fatal("Failed to connect to mongodb: ", zap.Error(err))
	}
	var s_db database.UserSettings_DB
	err = s_db.Connect()
	if err != nil {
		log.Fatal("Failed to connect to mongodb: ", zap.Error(err))
	}
	defer func() {
		if err := a_db.Disconnect(); err != nil {
			log.Fatal("update question routine failed to disconnect", zap.Error(err))
		}
		if err := s_db.Disconnect(); err != nil {
			log.Fatal("update question routine failed to disconnect", zap.Error(err))
		}
	}()

	// Launch api services
	transport.StartApiServer()
}
