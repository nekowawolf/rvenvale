package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/nekowawolf/rvenvale/config"
	"github.com/nekowawolf/rvenvale/middlewares"
	"github.com/nekowawolf/rvenvale/routes"
)

func main() {
	config.Init()

	app := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024,
	})

	app.Use(cors.New(middlewares.CorsConfig()))

	routes.SetupRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	if err := app.Listen(":" + port); err != nil {
		panic(err)
	}
}