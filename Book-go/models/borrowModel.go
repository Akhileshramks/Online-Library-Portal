package models

import (
	"gorm.io/gorm"
)

type Borrow struct {
	gorm.Model
	UserID     int     `gorm:"not null"`
	BookID     uint    `gorm:"not null"`
	BorrowDate string  `gorm:"type:date"`
	ReturnDate *string `gorm:"type:date"`
	Book       Book    `gorm:"foreignKey:BookID"`
}
