package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type Image struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Filename  string             `bson:"filename" json:"filename"`
	URL       string             `bson:"url" json:"url"`
	Size      int64              `bson:"size" json:"size"`
	Sha       string             `bson:"sha" json:"sha"`
	Path      string             `bson:"path" json:"path"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

type GitHubUploadRequest struct {
	Message string `json:"message"`
	Content string `json:"content"`
}

type GitHubUploadResponse struct {
	Content struct {
		Path string `json:"path"`
		Sha  string `json:"sha"`
	} `json:"content"`
}

type ImageStats struct {
	TotalImages int   `json:"total_images"`
	TotalSize   int64 `json:"total_size"`
}