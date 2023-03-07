package api

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"takebread/db/queries"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Server struct {
	router *chi.Mux
	queries *queries.Queries
	logger log.Logger
}

func NewServer(db *sql.DB, queries *queries.Queries ) *Server {
	
	r := chi.NewRouter()

	server := &Server{
		logger: *log.Default(),
		router: r,
		queries: queries,
	}
	
	server.initRouter()
	return server
}

func (s *Server) initRouter() {
	s.router.Use(middleware.Logger)

	s.router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome"))
	})
	s.router.Post("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome post"))
	})
	s.router.Post("/item", s.handlePostItem)
	s.router.Get("/item/{itemID}", s.handleGetItem)
	s.router.Put("/item/{itemID}", s.handlePutItem)

	s.router.Post("/list", s.handlePostList)
	s.router.Get("/list/{listID}", s.handleGetList)
	s.router.Put("/list/{listID}", s.handlePutList)

	s.router.Get("/lists", s.handleGetLists)
}

func (s *Server) Mux() http.Handler {
	return s.router
}


func (s *Server) logWriteError(err error) {
	if err != nil {
		s.logger.Println(err)
	}
}

func readAndUnmarshalBody[T any](r *http.Request) (*T, error){
	defer r.Body.Close()

	decoder := json.NewDecoder(r.Body)
	result := new(T)

	err := decoder.Decode(result)
	if err != nil {
		return nil, err
	}

	return result, nil
}
