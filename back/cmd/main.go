package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"takebread/db/queries"

	_ "github.com/lib/pq"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	// connect to DB
	// run migration
	// start http server

	db, err := sql.Open("postgres", "postgres://localhost:5432/perevozov?sslmode=disable")
	if err != nil {
		panic(err)
	}
	driver, err := postgres.WithInstance(db, &postgres.Config{
		DatabaseName: "perevozov",
	})
	if err != nil {
		panic(err)
	}
	m, err := migrate.NewWithDatabaseInstance("file://db/migrations", "postgres", driver)
	if err != nil {
		panic(err)
	}
	m.Log = new(migrateLogger)

	err = m.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		panic(err)
	}

	queries := queries.New(db)
	item, err := queries.CreateItem(context.Background(), "hello")

	fmt.Println(item.ID)
}

type migrateLogger struct {}
func (l migrateLogger) Printf(format string, v ...interface{}) {	fmt.Printf(format, v...)}
func (l migrateLogger) Verbose()bool {return true;}