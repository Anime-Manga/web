import mitt from "mitt";

import pkg from 'websocket';
const { w3cwebsocket } = pkg;

export default function useApi(){
    //load env
    const runtimeConfig = useRuntimeConfig();
    const hostSocket = ref(runtimeConfig.public.socketBase);

    //env
    const ws = ref(null);
    const room = ref(mitt());
    const started = ref(false);
    const failed = ref(false);

    //open socket
    function startWs(){
        console.log(ws.value);
        if(isNil(ws.value))
        {
            //init
            started.value = false;
            failed.value = false;

            ws.value = new w3cwebsocket(hostSocket.value);
            console.log("Starting connection to WebSocket Server");

            ws.value.onopen = function () {
                started.value = true;
                console.log("Successfully connected to the echo WebSocket Server");
                room.value.emit('checkRoom');
            };

            ws.value.onerror = function (err) {
                failed.value = true;
                console.log("Failed connected to the echo WebSocket Server", err);
                ws.value = null;
            };

            ws.value.onmessage = function (event) {
                console.log(event);
                room.value.emit('socket-message', event);
            }
        }else
            console.log("Already started connection to WebSocket Server");
    }

    //close socket
    function stopWs(){
        if(!isNil(ws.value))
        {
            ws.value.close();

            //init
            ws.value = null;
            started.value = false;
            failed.value = false;
        }
    }

    return{
        hostSocket,
        ws,
        room,
        started,
        failed,
        startWs,
        stopWs
    }
}