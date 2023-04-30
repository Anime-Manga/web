## 🌐Web Server
Questo progetto verrà utilizzato per gli utenti che vorranno scaricare anime e/o manga.
Hanno la possibilità di vedere l'anime con gli amici in tempo reale.

### Expose Ports:
- 3000 tcp

### Variabili globali richiesti:
```sh
example:
    #--- API ---
    API_BASE_URL: 'http://localhost:3333' #http://localhost:5000 [default]

    #--- General ---
    NODE_TLS_REJECT_UNAUTHORIZED: 0

    #--- Path ---
    HTTP_PATH: 'http://localhost:3333' #http://localhost:5002 [default]
    BASE_PATH: "/path" #"/public" [default]

    #--- WebSocket ---
    SOCKET_PATH: "ws://localhost:1111/path" #ws://localhost:5001/room [default]
    
    #--- Share link ---
    SHARE_ROOM: "http://localhost:33333" #http://localhost:3000 [default]

    #--- AUTH ---
    ORIGIN: "http://<your-ip>:3000" #http://localhost:3000
    NUXT_SECRET: "secret" #animemanga [default]
```