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
	type authInfo struct {
		Email string
		Password string
	}
	auth, err := readAndUnmarshalBody[authInfo](r)
	if err != nil {
		writers.WriteError(rw, err)
		return
	}
	if auth.Email == "" {
		writers.WriteError(rw, NewErrorWithStatus(http.StatusBadRequest, "email field is absent"))
		return
	}
	if auth.Password == "" {
		writers.WriteError(rw, NewErrorWithStatus(http.StatusBadRequest, "password is absent"))
	}

	user, err := s.queries.FindUserByEmail(r.Context(), auth.Email)
	if err != nil {
		writers.WriteError(rw, err)
		return
	}
	err = internal.CheckPasswordHash(auth.Password, user.PasswordHash)
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

	loginResult := models.LoginResult{
		SessionID: session.ID.String(),
		Expires: session.DateExpires.Time.Format(time.RFC3339),
	}

	writers.WriteJSON(rw, loginResult)
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