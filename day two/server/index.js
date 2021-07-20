const port=9999;
const http=require('http');
const webSocketServer=require('websocket').server;

const people={};

const gen=()=>{
    const id=()=>Math.floor(1+Math.random() * 0x10000).toString(16).substring(1);
    return id()+id()+"-"+id();
}

const hServer=http.createServer();
hServer.listen(port);
console.log("Server listening @ "+port);

const wServer=new webSocketServer({
    httpServer:hServer
});

wServer.on('request',(request)=>{
    const id=gen();
    console.log("Client connected "+new Date()+" from "+request.origin+".");


    const connection=request.accept(null,request.origin);
    people[id]=connection;
    console.log("Connection for "+id+" from  "+Object.getOwnPropertyNames(people));

    connection.on('message',(message)=>{
        if(message.type==="utf8")
        {
            console.log(message.utf8Data+" received from client");
        }

        for(key in people) {
            people[key].sendUTF(message.utf8Data);
            console.log('sent Message to: ', people[key]);
          }
    });
});