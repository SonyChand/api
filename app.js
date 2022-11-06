const bodyParser = require('body-parser');
const port = 3000;
const express = require('express');
const router = express.Router();
const app = express();
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const socketIO = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIO(server);
const client = new Client({
    authStrategy: new LocalAuth()
});



app.use(bodyParser.json());
app.use("/", router);

app.get('/', (req, res)=> {
    res.sendFile('index.html', {root:__dirname});
});


const db = require('./helpers/db');


client.on('message', async msg => {
    const contact = await msg.getContact();
    const nomornya = contact.number;
    const keyword = msg.body.toLowerCase();
    const replyMessage = await db.getReply(keyword, nomornya);

if(replyMessage !== false){
    msg.reply(replyMessage);
}


if (msg.body == '!ping') {
    msg.reply(nomornya);
}

client.on('change_state', state => {
    console.log('CHANGE STATE', state );
});

client.on('disconnected', (reason) => {
    // Destroy and reinitialize the client when disconnected
    client.destroy();
    client.initialize();
  });
    
});
 

client.initialize();

// Socket IO
io.on('connection', function(socket){
    socket.emit('message', 'Proses Autentikasi, mohon tunggu!!');

    client.on('qr', qr => {
        qrcode.toDataURL(qr, (err, url)=>{
            socket.emit('qr', url);
            socket.emit('message', 'QR Code diterima, Silahkan di SCAN');
        })
    });

    client.on('ready', () => {
        socket.emit('ready', 'Whatsapp API siap digunakan!!');
        socket.emit('message', 'Whatsapp API siap digunakan!!');
    });
    
    client.on('authenticated', (session) => {    
        socket.emit('authenticated', 'Proses Autentikasi Berhasil!!');
        socket.emit('message', 'Proses Autentikasi Berhasil!!');
    });
     


    });

    server.listen(port, () => {
    console.log(`API Whatsapp terhubung dengan PORT ${port}`)
  })


const api = async(req, res) => {

    const token = "AbahDaud12@";
    let nohp = req.query.nohp || req.body.nohp;
    let token1 = req.query.token || req.body.token;
    const pesan = req.query.pesan || req.body.pesan;

if(token1 !== token){
    return res.status(401).json({status:"Gagal", pesan:"Token tidak Valid!!"});
}

try{
    if(nohp.startsWith("0")){
        nohp = "62" + nohp.slice(1) + "@c.us";
    }else if(nohp.startsWith("62")){
        nohp = nohp + "@c.us";
    }else if(nohp.startsWith("8")){
        nohp = "62" + nohp + "@c.us";
    }else{
        res.json({ status: "Format Nomor Whatsapp tidak Valid!!", pesan:"Cobalah untuk menggunakan awalan (0/8/62)!!"});
    }

    const user = await client.isRegisteredUser(nohp);

    if(user){
        client.sendMessage(nohp, pesan);
        res.json({ status: "Berhasil terkirim", pesan});
    }else{
        res.json({ status: "Gagal", pesan:"Nomor Whatsapp tidak terdaftar"});
    }
}catch(error){

    console.log(error);
    res.status(500).json({status:"error", pesan:"Server Error"});
}

};

router.get("/api",api);
router.post("/api",api);
 





