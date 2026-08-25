package module

import (
	"fmt"
	"time"

	"github.com/nekowawolf/rvenvale/config"
	"github.com/nekowawolf/rvenvale/models"
	"github.com/nekowawolf/rvenvale/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const imageCollection = "images"

func InsertImage(filename, url, sha, path string, size int64) (interface{}, error) {
	ctx, cancel := utils.GetDBContext()
	defer cancel()

	newImage := models.Image{
		ID:        primitive.NewObjectID(),
		Filename:  filename,
		URL:       url,
		Size:      size,
		Sha:       sha,
		Path:      path,
		CreatedAt: time.Now(),
	}

	collection := config.Database.Collection(imageCollection)
	result, err := collection.InsertOne(ctx, newImage)
	if err != nil {
		return nil, fmt.Errorf("error inserting image: %v", err)
	}

	fmt.Printf("Inserted new image with ID: %v\n", result.InsertedID)
	return result.InsertedID, nil
}

func GetAllImages() ([]models.Image, error) {
	ctx, cancel := utils.GetDBContext()
	defer cancel()

	collection := config.Database.Collection(imageCollection)
	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, fmt.Errorf("error retrieving images: %v", err)
	}
	defer cursor.Close(ctx)

	var images []models.Image
	if err = cursor.All(ctx, &images); err != nil {
		return nil, fmt.Errorf("error decoding images: %v", err)
	}

	return images, nil
}

func GetImageByID(id primitive.ObjectID) (*models.Image, error) {
	ctx, cancel := utils.GetDBContext()
	defer cancel()

	collection := config.Database.Collection(imageCollection)
	filter := bson.M{"_id": id}

	var result models.Image
	err := collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func DeleteImageByID(id primitive.ObjectID) error {
	ctx, cancel := utils.GetDBContext()
	defer cancel()

	collection := config.Database.Collection(imageCollection)
	filter := bson.M{"_id": id}

	result, err := collection.DeleteOne(ctx, filter)
	if err != nil {
		return fmt.Errorf("error deleting image ID %s: %v", id.Hex(), err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("no image found with ID %s", id.Hex())
	}

	return nil
}

func GetImageStats() (*models.ImageStats, error) {
	ctx, cancel := utils.GetDBContext()
	defer cancel()

	collection := config.Database.Collection(imageCollection)

	total, err := collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("error counting images: %v", err)
	}

	pipeline := []bson.M{
		{"$group": bson.M{
			"_id":        nil,
			"total_size": bson.M{"$sum": "$size"},
		}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("error aggregating size: %v", err)
	}
	defer cursor.Close(ctx)

	var totalSize int64
	var aggResult []struct {
		TotalSize int64 `bson:"total_size"`
	}
	if err = cursor.All(ctx, &aggResult); err == nil && len(aggResult) > 0 {
		totalSize = aggResult[0].TotalSize
	}

	return &models.ImageStats{
		TotalImages: int(total),
		TotalSize:   totalSize,
	}, nil
}