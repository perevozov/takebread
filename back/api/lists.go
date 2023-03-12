package api

import (
	"net/http"
	"takebread/api/models"
	"takebread/db/queries"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func (s *Server) handlePutList(rw http.ResponseWriter, r *http.Request) {

}

func (s *Server) handleGetList(rw http.ResponseWriter, r *http.Request) {
	listID, err := uuid.Parse(chi.URLParam(r, "listID"))
	if err != nil {
		s.logWriteError(WriteError(rw, err))
		return
	}

	list, err := s.queries.GetList(r.Context(), listID)
	if err != nil {
		s.logWriteError(WriteError(rw, WrapSqlError(err)))
		return
	}

	items, err := s.queries.ListItemsByList(r.Context(), listID)
	if err != nil {
		s.logWriteError(WriteError(rw, WrapSqlError(err)))
		return
	}

	positionedItems := make([]*models.ItemWithPosition, len(items))
	for i := range items {
		positionedItems[i] = &models.ItemWithPosition{
			Item: models.Item{
				Title: &items[i].Title,
			},
			Position: int64(items[i].Position.Int32),
		}
	}

	result := models.ListWithItems{
		ID:    list.ID.String(),
		Title: Ptr(list.Title),
		Items: positionedItems,
	}

	WriteJSON(rw, result)
}

func (s *Server) handlePostList(rw http.ResponseWriter, r *http.Request) {
	listWithItems, err := readAndUnmarshalBody[models.List](r)
	if err != nil {
		s.logWriteError(WriteError(rw, err))
		return
	}

	var listID uuid.UUID
	var isNew bool
	if listWithItems.ID != "" {
		listID, err = uuid.Parse(listWithItems.ID)
		if err != nil {
			s.logWriteError(WriteError(rw, err))
			return
		}
	} else {
		isNew = true
	}
	
	
	if isNew {
		list, err := s.queries.CreateList(r.Context(), *listWithItems.Title)
		if err != nil {
			s.logWriteError(WriteError(rw, err))
			return
		}

		result := models.ListWithItems{
			ID: list.ID.String(),
			Title: &list.Title,
		}

		WriteJSON(rw, result)

		// listID = list.ID
	} else {
		_, err := s.queries.UpdateList(r.Context(), queries.UpdateListParams{
			ID:    listID,
			Title: *listWithItems.Title,
		})
		if err != nil {
			s.logWriteError(WriteError(rw, err))
			return
		}
	}
}

func (s *Server) handleGetLists(rw http.ResponseWriter, r *http.Request) {
	lists, err := s.queries.ListLists(r.Context())
	if err != nil {
		s.logWriteError(WriteError(rw, WrapSqlError(err)))
		return
	}
	result := make([]models.List, len(lists))
	for i := range lists {
		l := &lists[i]
		result[i] = models.List{
			ID: l.ID.String(),
			Title: &l.Title,
		}
	}
	WriteJSON(rw, result)
}
