package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nekowawolf/rvenvale/controllers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/rvenvale")

	api.Get("/images", controllers.GetAllImagesHandler)
	api.Get("/images/stats", controllers.GetImageStatsHandler)
	api.Post("/images", controllers.UploadImageHandler)
	api.Delete("/images/:id", controllers.DeleteImageHandler)
}