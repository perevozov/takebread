package api

import (
	"errors"
	"net/http"
	"takebread/api/models"
	"takebread/db/queries"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func (s *Server) handlePutItem(rw http.ResponseWriter, r *http.Request ) {
	model, err := readAndUnmarshalBody[models.Item](r)
	if err != nil {
		s.logWriteError(WriteError(rw, err))
		return
	}
	itemID, err := uuid.Parse(*model.ID)
	if err != nil {
		s.logWriteError(WriteError(rw, err))
		return
	}
	// TODO: validate

	item, err := s.queries.UpdateItem(r.Context(), queries.UpdateItemParams{
		ID: itemID,
		Title: *model.Title,
	})
	
	if err != nil {
		WriteError(rw, err)
	} else {
		WriteJSON(rw, item)
	}
}

func (s *Server) handleGetItem(rw http.ResponseWriter, r *http.Request ) {
	itemID, err := uuid.Parse(chi.URLParam(r, "itemID"))
	if err != nil {
		s.logWriteError(WriteError(rw, err))
		return
	}

	item, err := s.queries.GetItem(r.Context(), itemID)
	if err != nil {
		s.logWriteError(WriteError(rw, WrapSqlError(err)))
		return
	}
	
	WriteJSON(rw, item)
}

func (s *Server) handlePostItem(rw http.ResponseWriter, r *http.Request ) {
	item, err := readAndUnmarshalBody[models.Item](r)
	if err != nil {
		s.logWriteError(WriteError(rw, err))
		return
	}
	if item.Title == nil {
		WriteError(rw, errors.New("title is required"))
		return
	}

	var newItem queries.Item
	if item.ID != nil {
		var itemID uuid.UUID
		itemID, err = uuid.Parse(*item.ID)
		if err != nil {
			s.logWriteError(WriteError(rw, err))
			return
		}
		newItem, err = s.queries.CreateItemWithId(r.Context(), queries.CreateItemWithIdParams{
			ID: itemID,
			Title: *item.Title,
		})
		// TODO: update if item already exists
	} else {
		newItem, err = s.queries.CreateItem(r.Context(), *item.Title)
	}
	
	if err != nil {
		WriteError(rw, err)
	} else {
		WriteJSON(rw, newItem)
	}
}