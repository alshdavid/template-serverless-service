package main

import (
	"encoding/json"
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
		b, _ := json.Marshal(r.URL)
		fmt.Println("test")
		fmt.Println(r.Host)
		fmt.Println(string(b))
		io.WriteString(w, "Hello Test!")
	})

	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		b, _ := json.Marshal(r.URL)
		fmt.Println("fallback")
		fmt.Println(r.Host)
		fmt.Println(string(b))
		io.WriteString(w, "Catch all")
	})

	if os.Getenv("HTTPD") == "true" {
		http.ListenAndServe("0.0.0.0:3000", r)
	} else {
		lambda.Start(httpadapter.New(r).Proxy)
	}
}
