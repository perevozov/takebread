package api

import (
	"database/sql"
	"errors"
)

func Ptr[T any](value T) *T {
	return &value
}

type ErrorWithStatus struct {
	status int
	original error
}

func WrapSqlError(e error) ErrorWithStatus {
	status := 500
	if errors.Is(e, sql.ErrNoRows) {
		return ErrorWithStatus{
			status: 404,
			original: errors.New("not found"),
		}
	}
	
	return ErrorWithStatus{
		status: status,
		original: errors.New("database error"),
	}
}

func (es ErrorWithStatus)Error() string {
	return es.original.Error()
}

func (es ErrorWithStatus)Status() int {
	return es.status
}