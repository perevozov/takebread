package writers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"golang.org/x/exp/slog"
)

type Wired interface {
	ToWire() any
}

type ErrWithStatus interface {
	Status() int
}

func WriteJSON(rw http.ResponseWriter, response any) error {
	var marshalled []byte
	var err error

	if wired, ok := response.(Wired); ok {
		log.Println("wired")
		marshalled, err = json.Marshal(wired.ToWire())
	} else {
		log.Println("not wired")
		marshalled, err = json.Marshal(response)
	}

	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		return fmt.Errorf("response marshal error: %w", err)
	}

	rw.WriteHeader(200)
	rw.Header().Add("Content-type", "application/json")
	_, err = rw.Write(marshalled)
	if err != nil {
		return fmt.Errorf("response write error: %w", err)
	}

	return nil
}

func WriteError(rw http.ResponseWriter, err error) error {
	status := http.StatusInternalServerError
	if withStatus, ok := err.(ErrWithStatus); ok {
		status = withStatus.Status()
	}
	rw.WriteHeader(status)
	rw.Header().Add("Content-type", "text/text")
	var writeError error
	if status == http.StatusInternalServerError {
		slog.Error("internal server error: %w", err)
		_, writeError = rw.Write([]byte("Internal server error"))
	} else {
		_, writeError = rw.Write([]byte(err.Error()))
	}
	
	if writeError != nil {
		return fmt.Errorf("response write error: %w", writeError)
	}

	return nil
}
