package database

import (
	"database/sql"
	"fmt"
	"log"
	"net"
	"os"
	"sync"

	_ "github.com/lib/pq"
)

var (
	pgDB   *sql.DB
	pgOnce sync.Once
	pgErr  error
)

// ConnectPG establishes a connection to the PostgreSQL database using environment variables.
func ConnectPG() (*sql.DB, error) {
	pgOnce.Do(func() {
		pgUser := os.Getenv("POSTGRES_USER")
		pgPassword := os.Getenv("POSTGRES_PASSWORD")
		pgHost := os.Getenv("POSTGRES_HOST")
		pgPort := os.Getenv("POSTGRES_PORT")
		pgDatabase := os.Getenv("POSTGRES_DATABASE")

		connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			pgHost, pgPort, pgUser, pgPassword, pgDatabase)

		pgDB, pgErr = sql.Open("postgres", connStr)
		if pgErr != nil {
			pgErr = fmt.Errorf("failed to open postgres connection: %w", pgErr)
			return
		}

		pgErr = pgDB.Ping()
		if pgErr != nil {
			pgErr = fmt.Errorf("failed to ping postgres database: %w", pgErr)
			pgDB.Close() // Close the connection if ping fails
			pgDB = nil   // Reset pgDB so Do doesn't think it succeeded
			return
		}
		log.Println("Successfully connected to PostgreSQL database.")
	})
	return pgDB, pgErr
}

// GetUserIDByIP queries the linked_ips table for a user ID associated with an IP address.
// Note: Assumes the ipInt is the integer representation of an IPv4 address.
func GetUserIDByIP(ipInt int64) (string, error) {
	db, err := ConnectPG()
	if err != nil {
		return "", fmt.Errorf("failed to get postgres connection: %w", err)
	}

	// Convert integer IP back to string format for querying
	ipStr := intToIP(ipInt).String()
	if ipStr == "" {
		return "", fmt.Errorf("invalid integer IP address: %d", ipInt)
	}

	var userID string
	query := "SELECT user_id FROM linked_ips WHERE ip = $1 ORDER BY time DESC LIMIT 1" // Get the latest user for this IP

	err = db.QueryRow(query, ipStr).Scan(&userID)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil // No user found for this IP, not necessarily an error
		}
		return "", fmt.Errorf("error querying user_id for ip %s: %w", ipStr, err)
	}

	return userID, nil
}

// Helper function to convert IPv4 integer to net.IP
func intToIP(ipInt int64) net.IP {
	// Ensure it's within IPv4 range if needed, though net.IPv4 takes uint32
	if ipInt < 0 || ipInt > 0xFFFFFFFF {
		return nil // Or handle error appropriately
	}
	ip := make(net.IP, 4)
	ip[0] = byte(ipInt >> 24)
	ip[1] = byte(ipInt >> 16)
	ip[2] = byte(ipInt >> 8)
	ip[3] = byte(ipInt)
	return ip
}

// Optional: Add a function to close the PG connection when the application shuts down
func ClosePG() {
	if pgDB != nil {
		pgDB.Close()
		log.Println("PostgreSQL connection closed.")
	}
}
