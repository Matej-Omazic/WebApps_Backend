import express from 'express';
import storage from './storage.js';
import cors from 'cors';
import connect from './database.js'
import mongo from 'mongodb'

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


app.get('/games/:id', async (req, res) =>{
    let id = req.params.id;
    let db = await connect();

    let doc = await db.collection("games").findOne({_id: mongo.ObjectId(id)})
    //console.log(doc)
    res.json(doc);
})

//games
app.get('/games', async (req, res) =>{
    let db = await connect()
    let query = req.query;

    let selekcija = {}

    
    if(query.name){
        selekcija.name = new RegExp(query.name)
    }

    if (query.name2){
        let pretraga = query.name2
        let terms = pretraga.split(' ')

        selekcija = {
            $and: []
        };


        terms.forEach((term) =>{
            console.log("unutar petelje", term);
            let or = {
                $or: [ {name:new RegExp(term)}, {genre:new RegExp(term) }]
            }

            selekcija.$and.push(or)
        })
    }

   

    console.log("selekcija", selekcija)
    
    let cursor = await db.collection("games").find(selekcija)
    let results = await cursor.toArray()

    

    res.json(results)

    
})


//games
/**
app.get('/games', (req, res) => {
    let name = req.query.name
    
    let back_games = storage.games
    
    
    if (name) {
        back_games = back_games.filter(e => {
            return e.name.indexOf(name) >= 0
        })
    }
    res.json(back_games)
});
*/

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