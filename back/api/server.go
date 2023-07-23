package api

import (
	"database/sql"
	"encoding/json"
	"errors"
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
			return errors.New("wrong")
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
	defer r.Body.Close()

	decoder := json.NewDecoder(r.Body)
	result := new(T)

	err := decoder.Decode(result)
	if err != nil {
		return nil, err
	}

	return result, nil
}
