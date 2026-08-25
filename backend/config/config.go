package config

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Database *mongo.Database

func Init() {
	_ = godotenv.Load()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoURI := os.Getenv("MONGOSTRING")
	if mongoURI == "" || mongoURI == "mongodb+srv://your_user:your_password@cluster.mongodb.net/" {
		fmt.Println("\n[ERROR] MONGOSTRING environment variable is not properly configured.")
		fmt.Println("Please set it in your .env file before running the application.")
		os.Exit(1)
	}

	requiredVars := map[string]string{
		"GITHUB_TOKEN":    "your_github_personal_access_token",
		"GITHUB_USERNAME": "your_github_username",
		"GITHUB_REPO":     "your_github_repo_name",
	}

	for key, dummyValue := range requiredVars {
		val := os.Getenv(key)
		if val == "" || val == dummyValue {
			fmt.Printf("\n[ERROR] %s environment variable is missing or using the default dummy value.\n", key)
			fmt.Println("Please configure your .env file properly before starting the server.")
			os.Exit(1)
		}
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		fmt.Printf("Failed to connect to MongoDB: %v\n", err)
		os.Exit(1)
	}

	if err = client.Ping(ctx, nil); err != nil {
		fmt.Printf("Unable to ping MongoDB: %v\n", err)
		os.Exit(1)
	}

	Database = client.Database("rvenvale")
	fmt.Println("Successfully connected to MongoDB (rvenvale)")
}