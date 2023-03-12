package queries

import "takebread/api/models"

func (item Item) ToWire() any {
	public := models.Item{
		ID: item.ID.String(),
		Title: ptr(item.Title),
	}
	return public
}

func ptr[T any](value T ) *T {
	return &value
}

