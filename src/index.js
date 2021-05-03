import express from 'express';
import cors from 'cors';
import storage from './storage.js';

const app = express(); // instanciranje aplikacije
const port = 3000; // port na kojem će web server slušati

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Slušam na portu ${port}!`))



//users
app.get('/user', (req, res) => res.send(storage.user))

app.get('/user/:username', (req, res) => {
    
    let username  = req.params.username
    console.log("Trazena je igra pod ID", username);
    res.json(storage.user.filter((x) => x.nickname == username));

});



//games
app.get('/games', (req, res) => res.send(storage.games))

app.get('/games/:id', (req, res) => {
    
    let id  = req.params.id
    console.log("Trazena je igra pod ID", id);
    res.json(storage.games.filter((x) => x.game_id == id));

});



//comments
app.post('/comments', (req, res) => {
    
    console.log("Dodbio sam post")
    let doc = req.body;
    console.log(doc)
    storage.comments.push(doc)
    res.send({ status: "OK"});

});

app.get('/comments', (req, res) => res.send(storage.comments))

//playlist
app.get('/playlist', (req, res) => res.send(storage.playlist))