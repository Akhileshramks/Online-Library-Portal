package controllers

import (
	"lib/initializers"
	"lib/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func AdminLibOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role == "student" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admins only"})
			c.Abort()
			return
		}
		c.Next()
	}
}
func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admins only"})
			c.Abort()
			return
		}
		c.Next()
	}
}
func StudentOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "student" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Students only"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func BookCreate(c *gin.Context) {
	var entry struct {
		ISBN            int    `json:"isbn"`
		Title           string `json:"title"`
		Author          string `json:"author"`
		PublicationDate string `json:"publication_date"`
		Genre           string `json:"genre"`
		Availability    int    `json:"availability"`
	}

	// Bind incoming JSON payload to the entry struct
	if err := c.BindJSON(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Check for required fields
	if entry.ISBN == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ISBN is required and cannot be 0"})
		return
	}
	if entry.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}
	if entry.Availability == 0 {
		entry.Availability = 1 // Default to 1 if not provided
	}

	// Parse publication_date string into a time.Time object
	var publicationDate time.Time
	if entry.PublicationDate != "" {
		parsedDate, err := time.Parse("2006-01-02", entry.PublicationDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid publication_date format. Use YYYY-MM-DD"})
			return
		}
		publicationDate = parsedDate
	} else {
		publicationDate = time.Now() // Default to current time if publication_date is empty
	}

	book := models.Book{
		ISBN:            entry.ISBN,
		Title:           entry.Title,
		Author:          entry.Author,
		PublicationDate: publicationDate,
		Genre:           entry.Genre,
		Availability:    entry.Availability,
	}

	// Save the new book record to the database
	result := initializers.DB.Create(&book)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"book": book,
	})
}

func BookRead(c *gin.Context) {
	var books []models.Book
	initializers.DB.Find(&books)

	c.JSON(http.StatusOK, gin.H{
		"books": books,
	})

}

func BookSearch(c *gin.Context) {
	query := c.Query("query") // Assuming you pass query parameters like /search?query=keyword

	var books []models.Book
	// Using WHERE clause with LIKE to search across multiple columns
	initializers.DB.Where("isbn LIKE ? OR title LIKE ? OR author LIKE ? OR genre LIKE ?", "%"+query+"%", "%"+query+"%", "%"+query+"%", "%"+query+"%").Find(&books)

	if len(books) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No books found matching the query"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"books": books})
}

func BookUpdate(c *gin.Context) {

	id := c.Param("id")

	var entry struct {
		ISBN            int    `json:"isbn"`
		Title           string `json:"title"`
		Author          string `json:"author"`
		PublicationDate string `json:"publication_date"` // Accept date as string
		Genre           string `json:"genre"`
		Availability    int    `json:"availability"`
	}
	c.BindJSON(&entry)

	var book models.Book
	initializers.DB.First(&book, id)

	var publicationDate time.Time
	if entry.PublicationDate != "" {
		parsedDate, err := time.Parse("2006-01-02", entry.PublicationDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid publication_date format. Use YYYY-MM-DD"})
			return
		}
		publicationDate = parsedDate
	} else {
		publicationDate = time.Now() // Default to current time if publication_date is empty
	}

	n_book := models.Book{
		ISBN:            entry.ISBN,
		Title:           entry.Title,
		Author:          entry.Author,
		PublicationDate: publicationDate,
		Genre:           entry.Genre,
		Availability:    entry.Availability,
	}

	initializers.DB.Model(&book).Updates(&n_book)

	c.JSON(http.StatusOK, gin.H{
		"books": n_book,
	})

}

func BookDelete(c *gin.Context) {
	id := c.Param("id")
	initializers.DB.Delete(&models.Book{}, id)
	c.JSON(http.StatusOK, gin.H{
		"status": "Deleted Successfully",
	})

}
