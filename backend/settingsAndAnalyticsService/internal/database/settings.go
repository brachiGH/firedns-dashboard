package database

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserSettings_DB struct {
	General       *mongo.Collection
	Privacy       *mongo.Collection
	Parental      *mongo.Collection
	DenyAllowList *mongo.Collection
	client        *mongo.Client
}

var global_settings_db *UserSettings_DB

func GetSettingsDB() (*UserSettings_DB, error) {
	if global_settings_db != nil {
		return global_settings_db, nil
	}

	return nil, fmt.Errorf("not connected to db")
}

func (a *UserSettings_DB) Connect() error {
	// Interface on your machine.
	// MongoDB URI and database name
	uri := os.Getenv("MONGO_DB_URI")
	const dbName = "FireDNSUserSettings"

	// Set client options
	clientOptions := options.Client().ApplyURI(uri)

	var err error
	// Connect to MongoDB
	a.client, err = mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		return fmt.Errorf("error connecting to db: %w", err)
	}

	// Check the connection
	err = a.client.Ping(context.Background(), nil)
	if err != nil {
		return fmt.Errorf("error connecting to db: connection check failed: %w", err)
	}

	fmt.Println("Connected to MongoDB!")

	// Get a handle for the collection
	a.General = a.client.Database(dbName).Collection("general")
	a.Privacy = a.client.Database(dbName).Collection("privacy")
	a.Parental = a.client.Database(dbName).Collection("parental")
	a.DenyAllowList = a.client.Database(dbName).Collection("DenyAllowList")

	// Set global db
	global_settings_db = a

	return nil
}

func (a *UserSettings_DB) Disconnect() error {
	if err := a.client.Disconnect(context.Background()); err != nil {
		return fmt.Errorf("error disconnecting from db: %w", err)
	}
	return nil
}

func (a *UserSettings_DB) Update(ip bson.M, doc bson.M, collection *mongo.Collection) (ID interface{}, err error) {
	updateOptions := options.Update().SetUpsert(true)
	insertOneResult, err := collection.UpdateOne(context.Background(), ip, doc, updateOptions)
	if err != nil {
		return nil, fmt.Errorf("error updating db: %w", err)
	}

	return insertOneResult.UpsertedID, nil
}

func (a *UserSettings_DB) UpdateMany(updates []mongo.WriteModel, collection *mongo.Collection) error {
	_, err := collection.BulkWrite(context.Background(), updates)
	if err != nil {
		return fmt.Errorf("error updating many docs: %w", err)
	}

	return nil
}
