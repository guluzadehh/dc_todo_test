package main

import (
	"io"
	"log"
	"net/http"
)

const BASE_URL = "https://todo.doczilla.pro"

func main() {
	fs := http.FileServer(http.Dir("./static/"))
	http.Handle("/", fs)

	http.HandleFunc("/api/todos", proxy)
	http.HandleFunc("/api/todos/find", proxy)
	http.HandleFunc("/api/todos/date", proxy)

	log.Println("Listening on 8000")
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatal(err)
	}
}

func proxy(w http.ResponseWriter, r *http.Request) {
	req, err := http.NewRequestWithContext(r.Context(), r.Method, BASE_URL+r.URL.Path, r.Body)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte{})
		return
	}

	req.URL.RawQuery = r.URL.Query().Encode()

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte{})
		return
	}

	io.Copy(w, res.Body)
}
