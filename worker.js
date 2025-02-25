addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const url = new URL(request.url)
    // Lokalny adres serwera – tylko dostępny z sieci lokalnej (nie publiczny)
    const backendBase = "http://192.168.10.101:8001"
    
    // Na podstawie ścieżki żądania (path) kierujemy do odpowiedniej usługi.
    // Zakładamy, że publiczne żądanie ma ścieżkę identyczną jak u Ciebie.
    const newUrl = backendBase + url.pathname + url.search
    console.log("Proxying request to:", newUrl)

    // Tworzymy nowe żądanie, kopiując metodę, nagłówki i body oryginalnego żądania
    const modifiedRequest = new Request(newUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    })

    // Pobieramy odpowiedź z lokalnego serwera
    const response = await fetch(modifiedRequest)
    
    // Opcjonalnie: możesz zmodyfikować odpowiedź, np. dodać nagłówki CORS
    const newHeaders = new Headers(response.headers)
    newHeaders.set("Access-Control-Allow-Origin", "*")
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    })
  } catch (err) {
    return new Response("Error: " + err.message, { status: 500 })
  }
}
