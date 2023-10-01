package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"takebread/api/middleware"
	"takebread/db/queries"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
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
	s.router.Use(chiMiddleware.Logger)

	s.router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome"))
	})
	s.router.Post("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome post"))
	})
	
	s.router.Post("/login", s.handleLogin)
	s.router.Post("/register", s.handleRegister)

	// require authorization
	s.router.Group(func(r chi.Router) {
		r.Use(middleware.Auth(middleware.AuthFunction(func(token string) error {
			return fmt.Errorf("wrong token %s", token)
		})))

		r.Post("/item", s.handlePostItem)
		r.Get("/item/{itemID}", s.handleGetItem)
		r.Put("/item/{itemID}", s.handlePutItem)
	
		r.Post("/list", s.handlePostList)
		r.Get("/list/{listID}", s.handleGetList)
		r.Put("/list/{listID}", s.handlePutList)
		r.Put("/list/{listID}/item", s.handleAddItemToList)
	
		r.Get("/lists", s.handleGetLists)	
	})
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
	result := new(T)
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(result)
	r.Body.Close()
	
	if err != nil {
		return nil, err
	}

	return result, nil
}
