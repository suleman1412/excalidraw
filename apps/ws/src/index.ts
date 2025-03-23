import { WebSocket, WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

interface messageType{
  type: 'join_room' | 'chat' | 'leave_room',
  roomId?: string,
  message?: string 
}

const rooms: { [roomId: string]: WebSocket[] } = {}

const join_room = (ws: WebSocket, roomId: string) => {
  if(!rooms[roomId]){
    rooms[roomId] = []
  }

  rooms[roomId].push(ws)
  console.log(`User joined room: ${roomId}. Total users: ${rooms[roomId].length}`);
}

const leave_room = (ws: WebSocket, roomId: string) => {
  if (!rooms[roomId]) {
    return;
  }

  rooms[roomId] = rooms[roomId].filter(client => client !== ws);
  console.log(`User left room: ${roomId}. Remaining users: ${rooms[roomId].length}`);
}

const chat_room = (ws: WebSocket, roomId: string, message: string) => {
  if (!rooms[roomId]) {
    return;
  }

  rooms[roomId].forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};



wss.on('connection', (socket) => {
  console.log('New server joined')

  socket.on('message', (message) => {
    try {
      const parsedMessage: messageType = JSON.parse(message.toString())
      if (parsedMessage.roomId && parsedMessage.type) {
        if(parsedMessage.type === 'join_room'){
          join_room(socket, parsedMessage.roomId)
        } else if (parsedMessage.type === 'leave_room'){
          leave_room(socket, parsedMessage.roomId)
        } else if(parsedMessage.type === 'chat'){
          if(!parsedMessage.message){
            socket.send(JSON.stringify({ error: "Message is required" }))
            return
          }
          chat_room(socket, parsedMessage.roomId, parsedMessage.message)
        }
      } else{
        socket.send(JSON.stringify({ error: 'RoomId or Type not provided' }))
        return
      }
    } catch (e) {
      console.error(e)
      socket.send(JSON.stringify({ error: e }))
    }
  })

})
