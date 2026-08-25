package middlewares

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2/middleware/cors"
)

func CorsConfig() cors.Config {
	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000"
	}

	origins := strings.Split(allowedOrigin, ",")
	for i, o := range origins {
		origins[i] = strings.TrimSpace(o)
	}

	return cors.Config{
		AllowOrigins:     strings.Join(origins, ","),
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		ExposeHeaders:    "Content-Length",
		AllowCredentials: true,
	}
}