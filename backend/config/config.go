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