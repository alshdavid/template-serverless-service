package main

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r)
		io.WriteString(w, "Hello Test!")
	})

	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r)
		io.WriteString(w, "Catch all")
	})

	if os.Getenv("HTTPD") == "true" {
		http.ListenAndServe("0.0.0.0:3000", r)
	} else {
		lambda.Start(httpadapter.New(r).ProxyWithContext)
	}
}
