package utils

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetDBContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), 10*time.Second)
}

func ParseObjectID(c *fiber.Ctx, param string) (primitive.ObjectID, error) {
	id, err := primitive.ObjectIDFromHex(c.Params(param))
	if err != nil {
		_ = c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ID format",
		})
		return primitive.NilObjectID, err
	}
	return id, nil
}