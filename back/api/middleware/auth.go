package middleware

import (
	"net/http"
	"strings"
	"takebread/api/writers"
)

type sessionAuthenticator interface {
	authenticate(token string) error
}

type AuthFunction func(token string) error
func (a AuthFunction) authenticate(token string) error {
	return a(token)
}

type authError struct {
	message string
}

func (ae authError) Error() string {
	return ae.message
}

func (ae authError) Status() int {
	return http.StatusUnauthorized
}

func newAuthError (message string) authError {
	return authError{
		message: message,
	}
}

func Auth(authenticator sessionAuthenticator) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				writers.WriteError(rw, newAuthError("authorization header is not found"))
				return
			}

			if !strings.HasPrefix(authHeader, "Bearer ") {
				writers.WriteError(rw, newAuthError("authorization schema is not supported"))
				return
			}

			token := authHeader[7:]

			authErr := authenticator.authenticate(token)
			if authErr != nil {
				writers.WriteError(rw, newAuthError(authErr.Error()))
				return
			}

			next.ServeHTTP(rw, r)
		})
	}
}