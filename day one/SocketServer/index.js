const websocket=require('ws')

const wss=new websocket.Server({port:9999});

wss.on("connection",ws=>{
    console.log("Connection established");

    ws.on("close",()=>{
        console.log("Client connection lost");
    });

    ws.on("message",data=>{
        console.log(`Client has sent ${data}`);

        ws.send("Thanks for contacting Zealous");
    });

});