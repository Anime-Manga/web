## 🌐Web Server
Questo progetto verrà utilizzato per gli utenti che vorranno scaricare anime e/o manga.
Hanno la possibilità di vedere l'anime con gli amici in tempo reale.

### Expose Ports:
- 3000 tcp

### Variabili globali richiesti:
```sh
example:
    #--- API ---
    NUXT_API_BASE: 'http://localhost:3333' #http://localhost:5000 [default]

    #--- Path ---
    NUXT_PUBLIC_HTTP_BASE: 'http://localhost:3333' #http://localhost:5002 [default]
    NUXT_PUBLIC_BASE_PATH: "/path" #"/public" [default]

    #--- WebSocket ---
    NUXT_PUBLIC_SOCKET_BASE: "ws://localhost:1111/path" #ws://localhost:5001/room [default]
    
    #--- Share link ---
    NUXT_PUBLIC_WEB_BASE: "http://localhost:33333" #http://localhost:3000 [default]

    #--- AUTH ---
    NUXT_PUBLIC_AUTH_ORIGIN: "http://<your-ip>:3000" #http://localhost:3000
    NUXT_SECRET: "secret" #animemanga [default]
```