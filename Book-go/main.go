package main

import (
	"context"
	"lib/controllers"
	"lib/initializers"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	mongoClient *mongo.Client
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.ConnectToMongoDB()
	mongoClient = initializers.GetMongoClient()
}
func logRequestMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()
		c.Next()

		// Log request to MongoDB
		collection := mongoClient.Database("library_logs").Collection("go_log_records")
		logEntry := bson.M{
			"path":       c.Request.URL.Path,
			"method":     c.Request.Method,
			"client_ip":  c.ClientIP(),
			"user_agent": c.Request.UserAgent(),
			"status":     c.Writer.Status(),
			"latency":    time.Since(start).Milliseconds(),
			"timestamp":  time.Now(),
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		_, err := collection.InsertOne(ctx, logEntry)
		if err != nil {
			log.Printf("Error inserting request log: %v", err)
		}
	}
}

func main() {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Access-Control-Allow-Headers", "Access-Control-Allow-Origin"}
	r.Use(cors.New(config))

	r.Use(controllers.Auth())
	r.Use(logRequestMiddleware())
	r.POST("/book", controllers.AdminLibOnly(), controllers.BookCreate)
	r.GET("/view", controllers.AdminLibOnly(), controllers.BookRead)
	r.GET("/search/:id", controllers.BookSearch)
	r.PUT("/book/:id", controllers.AdminLibOnly(), controllers.BookUpdate)
	r.DELETE("/book/:id", controllers.AdminLibOnly(), controllers.BookDelete)
	r.GET("/allTransactions", controllers.AdminLibOnly(), controllers.BorrowAllFetch)

	// Borrow routes
	r.POST("/borrow", controllers.StudentOnly(), controllers.BorrowCreate)
	r.GET("/viewStudent", controllers.BookRead)
	r.PUT("/return", controllers.StudentOnly(), controllers.BorrowReturn)
	r.GET("/borrow/user", controllers.StudentOnly(), controllers.BorrowFetch)
	r.GET("/borrow/number", controllers.StudentOnly(), controllers.BorrowNumber)
	r.GET("/isBookBorrowed", controllers.StudentOnly(), controllers.IsBookBorrowed)

	r.Run()
}
