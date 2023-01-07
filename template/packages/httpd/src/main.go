package main

import (
	"io"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/gorillamux"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/api/test", func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "Hello Test!")
	})

	r.PathPrefix("/api").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "Catch all")
	})

	if os.Getenv("HTTPD") == "true" {
		http.ListenAndServe("0.0.0.0:3000", r)
	} else {
		adapter := gorillamux.NewV2(r)
		lambda.Start(adapter.ProxyWithContext)
	}
}
