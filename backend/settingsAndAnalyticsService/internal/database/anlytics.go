package database

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Analytics_DB struct {
	collection *mongo.Collection
	client     *mongo.Client
}

var global_analytics_db *Analytics_DB

func GetAnalyticsDB() (*Analytics_DB, error) {
	if global_analytics_db != nil {
		return global_analytics_db, nil
	}

	return nil, fmt.Errorf("not connected to db")
}

func (a *Analytics_DB) Connect() error {
	// Interface on your machine.
	// MongoDB URI and database name
	uri := os.Getenv("MONGO_DB_URI")
	const dbName = "FireDNSanalytics"
	const collectionName = "DNSmessages"

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
	a.collection = a.client.Database(dbName).Collection(collectionName)

	// Set global db
	global_analytics_db = a

	return nil
}

func (a *Analytics_DB) Disconnect() error {
	if err := a.client.Disconnect(context.Background()); err != nil {
		return fmt.Errorf("error disconnecting from db: %w", err)
	}
	return nil
}

func (a *Analytics_DB) Update(ip bson.M, doc bson.M) (ID interface{}, err error) {
	updateOptions := options.Update().SetUpsert(true)
	insertOneResult, err := a.collection.UpdateOne(context.Background(), ip, doc, updateOptions)
	if err != nil {
		return nil, fmt.Errorf("error updating db: %w", err)
	}

	return insertOneResult.UpsertedID, nil
}

func (a *Analytics_DB) UpdateMany(updates []mongo.WriteModel) error {
	_, err := a.collection.BulkWrite(context.Background(), updates)
	if err != nil {
		return fmt.Errorf("error updating many docs: %w", err)
	}

	return nil
}
