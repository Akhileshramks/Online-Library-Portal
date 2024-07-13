package main

import (
	"lib/initializers"
	"lib/models"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {
	initializers.DB.AutoMigrate(&models.Book{})
	initializers.DB.AutoMigrate(&models.Borrow{})
}
