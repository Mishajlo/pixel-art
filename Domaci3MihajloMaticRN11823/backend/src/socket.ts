import { Server } from 'socket.io'
import { AppDataSource } from './database'
import { Slika } from './entities/picture'
import { Korisnik } from './entities/user'
import jwt from 'jsonwebtoken'

const korisnici = AppDataSource.getRepository(Korisnik)

export const setupSocket = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token?.split(" ")[1];
    if (!token) {
      return next(new Error("Token nije obezbeđen."));
    }

    try {
      const decoded = jwt.verify(token, "secret") as {
        id: number;
        username: string;
      };
      socket.data.user = decoded; // Dodajemo korisnika u socket.data
      next();
    } catch (error) {
      return next(new Error("Nevažeći token."));
    }
  });

  io.on('connection', socket => {
    console.log(`User connected: ${socket.data.user.username}`)

    

    socket.on("join", ({ roomId, userId, token }) => {
      if(token){
       socket.join(roomId);
       socket.to(roomId).emit("userJoined", { userId, roomId });
       
      }
     });

     socket.on("leave", ({ roomId, userId }) => {
      socket.to(roomId).emit("userLeft", { userId, roomId });
      const korisnicko = socket.data.user.username
      socket.to(roomId).emit("userLefty", { username: korisnicko });

      console.log(`User disconnected: ${socket.data.user.username}`)
      socket.leave(roomId);
  
    });

    socket.on('klik', ({i, j, boja, roomId}) => {
      //console.log("i: " + i + " j: " + j + " boja: " + boja )
      socket.to(roomId).emit("compel", {i,j,boja:boja})
    })

    socket.on('duzina', ({roomId, size}) => {
      console.log(size)
      socket.broadcast.to(roomId).emit('menjaj', {size:size})
     // socket.to(roomId).emit('menjaj', {size: size})
    })

    socket.on('dopuna', ({roomId, sizic}) => {
      socket.broadcast.to(roomId).emit('dodatno', {sizic})
    })


    socket.on('kurcor', async ({x, y, roomId, user}) => {
      //console.log("jel si usao uopste")
      try{
        //console.log("usao ovde??")
        const trenutni = await korisnici.findOne({
          where : {user_id : user}
        })
        console.log(roomId)
        const uzer = trenutni.username
        console.log(uzer)
        if (trenutni){
          console.log("usao?")
          socket.broadcast.to(roomId).emit('b2b', { x:x, y:y, username: uzer })
          }

      }catch(greska){
        console.log(greska)
      }
    })
  

  })
}
