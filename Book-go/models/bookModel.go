package models

import (
	"time"

	"gorm.io/gorm"
)

type Book struct {
	gorm.Model
	ISBN            int    `gorm:"unique"`
	Title           string `gorm:"not null"`
	Author          string
	PublicationDate time.Time `gorm:"type:date"`
	Genre           string
	Availability    int `gorm:"default:1"`
}
