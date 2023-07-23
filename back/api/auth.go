package api

import (
	"database/sql"
	"net/http"
	"takebread/api/internal"
	"takebread/api/models"
	"takebread/api/writers"
	"takebread/db/queries"
	"time"
)


func (s *Server) handleLogin(rw http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		writers.WriteError(rw, err)
		return
	}
	email := r.Form.Get("email")
	if email == "" {
		writers.WriteError(rw, NewErrorWithStatus(http.StatusBadRequest, "email field is absent"))
		return
	}
	password := r.Form.Get("password")
	if password == "" {
		writers.WriteError(rw, NewErrorWithStatus(http.StatusBadRequest, "password is absent"))
	}

	user, err := s.queries.FindUserByEmail(r.Context(), email)
	if err != nil {
		writers.WriteError(rw, err)
		return
	}
	err = internal.CheckPasswordHash(password, user.PasswordHash)
	if err != nil {
		writers.WriteError(rw, err)
		return
	}

	session, err := s.queries.CreateSession(r.Context(), queries.CreateSessionParams{
		UserID: user.ID,
		DateExpires: sql.NullTime{Time: time.Now().Add(24 * time.Hour), Valid: true},
	})

	if err != nil {
		writers.WriteError(rw, err)
		return
	}

	writers.WriteJSON(rw, session)
}

func (s *Server) handleRegister(rw http.ResponseWriter, r *http.Request) {
	newUserFields, err := readAndUnmarshalBody[models.NewUser](r)
	if err != nil {
		writers.WriteError(rw, WithStatus(http.StatusBadRequest, err))
		return
	}

	hash, err := internal.HashPassword(newUserFields.Password)
	if err != nil {
		writers.WriteError(rw, WithStatus(http.StatusInternalServerError, err))
	}
	user, err := s.queries.CreateUser(r.Context(), queries.CreateUserParams{
		Email: newUserFields.Email,
		PasswordHash: hash,
	})
	if err != nil {
		writers.WriteError(rw, WithStatus(http.StatusInternalServerError, err))
	}

	writers.WriteJSON(rw, map[string]any{
		"user_id": user.ID,
	})
}