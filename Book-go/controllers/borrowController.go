package controllers

import (
	"errors"
	"lib/initializers"
	"lib/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func BorrowCreate(c *gin.Context) {
	var entry struct {
		BookID uint `json:"book_id" binding:"required"`
	}
	user_id := c.GetInt("user_id")
	// Bind incoming JSON payload to the entry struct
	if err := c.BindJSON(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Check if the book exists and is available
	var book models.Book
	if result := initializers.DB.First(&book, entry.BookID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	if book.Availability <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Book not available for borrowing"})
		return
	}

	// Check if the user has already borrowed this book and has not returned it yet
	var existingBorrow models.Borrow
	if result := initializers.DB.Where("user_id = ? AND book_id = ? AND return_date IS NULL", user_id, entry.BookID).First(&existingBorrow); result.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User has already borrowed this book and has not returned it"})
		return
	}

	// Decrement availability
	book.Availability--
	if result := initializers.DB.Save(&book); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book availability"})
		return
	}

	now := time.Now()
	dateString := now.Format("2006-01-02")
	borrow := models.Borrow{
		UserID:     user_id,
		BookID:     entry.BookID,
		BorrowDate: dateString,
	}

	// Save the new borrow record to the database
	if result := initializers.DB.Create(&borrow); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"borrow": borrow,
	})
}

func BorrowReturn(c *gin.Context) {

	var entry struct {
		BorrowID uint `json:"borrow_id" binding:"required"`
	}

	// Bind incoming JSON payload to the entry struct
	if err := c.BindJSON(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Query the borrow entry by BorrowID
	var borrow models.Borrow
	if result := initializers.DB.First(&borrow, entry.BorrowID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Borrow entry not found"})
		return
	}

	// Check if the return date is already set
	if borrow.ReturnDate != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Book has already been returned"})
		return
	}

	// Update the return date to current date
	now := time.Now()
	dateString := now.Format("2006-01-02")
	borrow.ReturnDate = &dateString

	// Update the return_date column in the database
	if result := initializers.DB.Model(&borrow).Where("id = ?", entry.BorrowID).Update("return_date", dateString); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update return date"})
		return
	}

	// Increase the book availability by 1
	var book models.Book
	if result := initializers.DB.First(&book, borrow.BookID); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find associated book"})
		return
	}
	book.Availability++
	if result := initializers.DB.Save(&book); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book availability"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"borrow": borrow})
}

func BorrowFetch(c *gin.Context) {
	user_id := c.GetInt("user_id")
	var borrows []models.Borrow
	if result := initializers.DB.Preload("Book").Where("user_id = ?", user_id).Find(&borrows); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(200, gin.H{"borrows": borrows})
}

func IsBookBorrowed(c *gin.Context) {
	userID := c.GetInt("user_id")
	bookIDStr := c.Query("book_id")
	bookID, err := strconv.Atoi(bookIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book_id"})
		return
	}

	var borrow models.Borrow
	if result := initializers.DB.Where(" return_date is NULL and user_id = ? AND book_id = ? ", userID, bookID).First(&borrow); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			// No borrow record found for the book and user
			c.JSON(http.StatusOK, gin.H{"is_borrowed": 0})
			return
		}
		// Handle other errors
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Borrow record found
	c.JSON(http.StatusOK, gin.H{"is_borrowed": 1})
}

func BorrowNumber(c *gin.Context) {
	var count int64
	user_id := c.GetInt("user_id")
	if result := initializers.DB.Model(&models.Borrow{}).Where("user_id = ? AND return_date IS NULL", user_id).Count(&count); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(200, gin.H{"number_of_books_borrowed": count})
}

func BorrowAllFetch(c *gin.Context) {
	var borrows []models.Borrow
	db := initializers.DB.Preload("Book")

	// Check if book_id query parameter is provided
	bookID := c.Query("book_id")
	if bookID != "" {
		db = db.Where("book_id = ?", bookID)
	}

	if result := db.Find(&borrows); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(200, gin.H{"borrows": borrows})
}
