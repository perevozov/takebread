package main

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/http"
	"takebread/api"
	"takebread/db/queries"

	_ "github.com/lib/pq"
	"golang.org/x/exp/slog"

	migrate "github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	// connect to DB
	// run migration
	// start http server

	db, err := sql.Open("postgres", "postgres://localhost:5432/perevozov?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	err = migrateUp(db)
	if err != nil {
		log.Fatal(err)
	}
	
	q := queries.New(db)
	server := api.NewServer(db, q)

	slog.Info("listening :8080")
	err = http.ListenAndServe(":8080", server.Mux())
	if err != nil {
		log.Fatal(err)
	}
}

type migrateLogger struct{}

func (l migrateLogger) Printf(format string, v ...interface{}) { fmt.Printf(format, v...) }
func (l migrateLogger) Verbose() bool                          { return true }


func migrateUp(db *sql.DB) error {
	driver, err := postgres.WithInstance(db, &postgres.Config{
		DatabaseName: "perevozov",
	})
	if err != nil {
		return err
	}
	m, err := migrate.NewWithDatabaseInstance("file://db/migrations", "postgres", driver)
	if err != nil {
		panic(err)
	}
	m.Log = new(migrateLogger)

	err = m.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return err
	}

	return nil
}