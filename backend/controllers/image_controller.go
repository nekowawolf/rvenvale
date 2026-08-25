package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nekowawolf/rvenvale/module"
	"github.com/nekowawolf/rvenvale/utils"
)

func UploadImageHandler(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "file is required",
		})
	}

	if fileHeader.Size > 10*1024*1024 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "file size must be less than 10MB",
		})
	}

	file, err := fileHeader.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to open file",
		})
	}
	defer file.Close()

	cdnURL, sha, path, finalSize, err := utils.UploadToGitHub(file, fileHeader)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	insertedID, err := module.InsertImage(
		fileHeader.Filename,
		cdnURL,
		sha,
		path,
		finalSize,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to save image record to database",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Image uploaded successfully",
		"data": fiber.Map{
			"_id":      insertedID,
			"filename": fileHeader.Filename,
			"url":      cdnURL,
			"size":     finalSize,
			"sha":      sha,
			"path":     path,
		},
	})
}

func GetAllImagesHandler(c *fiber.Ctx) error {
	images, err := module.GetAllImages()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Images retrieved successfully",
		"data":    images,
	})
}

func GetImageStatsHandler(c *fiber.Ctx) error {
	stats, err := module.GetImageStats()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Stats retrieved successfully",
		"data":    stats,
	})
}

func DeleteImageHandler(c *fiber.Ctx) error {
	id, err := utils.ParseObjectID(c, "id")
	if err != nil {
		return err
	}

	img, err := module.GetImageByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "image not found",
		})
	}

	if err := utils.DeleteFromGitHub(img.Path, img.Sha); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := module.DeleteImageByID(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to delete image from database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Image deleted successfully",
	})
}