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
    console.log("Trazena je user pod ID", username);
    res.json(storage.user.filter((x) => x.nickname == username));

});





app.get('/games/:id', async (req, res) =>{
    let id = req.params.id;
    let db = await connect();

    let doc = await db.collection("games").findOne({_id: mongo.ObjectId(id)})
    res.json(doc)
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
            //console.log("unutar petelje", term);
            let or = {
                $or: [ {name:new RegExp(term)}, {genre:new RegExp(term) }]
            }

            selekcija.$and.push(or)
        })
    }

   

    //console.log("selekcija", selekcija)
    
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

//GTAV
app.get('/GtaV', async (req, res) =>{
    let db = await connect()
    
    let cursor = await db.collection("comments").find({game_id: "1001"}) 
    let results = await cursor.toArray()
    res.json(results)
    
})


app.post('/GtaV', async (req,res)=>{
    let data = req.body;

    delete data._id;

    let db = await connect();
    let result = await db.collection("comments").insertOne(data)
    
    if(result && result.insertedCount == 1){
        res.json(result.ops[0])
    }
    else{
        res.json({
            status: "fail"
        });
    }
    
})



app.patch('/GtaV/:id', async(req,res)=>{
    let id = req.params.id;
    let data = req.body;
    
    let db = await connect ()
    let result = await db.collection("comments").updateOne(
        {_id: mongo.ObjectID(id)},
        {
            $set:data
        }
    )
    if(result && result.modifiedCount == 1){
        let doc = await db.collection("comments").findOne({
            _id:mongo.ObjectID(id)
        })
        res.json(doc)
    }
    else{
        res.json({status:"fail"})
    }

})


//Zelda
app.get('/Zelda', async (req, res) =>{
    let db = await connect()
    
    let cursor = await db.collection("comments").find({game_id: "1002"}) 
    let results = await cursor.toArray()
    res.json(results)
    
})


app.post('/Zelda', async (req,res)=>{
    let data = req.body;

    delete data._id;

    let db = await connect();
    let result = await db.collection("comments").insertOne(data)
    
    if(result && result.insertedCount == 1){
        res.json(result.ops[0])
    }
    else{
        res.json({
            status: "fail"
        });
    }
    
})

//It takes 2
app.get('/It_takes_2', async (req, res) =>{
    let db = await connect()
    
    let cursor = await db.collection("comments").find({game_id: "1003"}) 
    let results = await cursor.toArray()
    res.json(results)
    
})


app.post('/It_takes_2', async (req,res)=>{
    let data = req.body;

    delete data._id;

    let db = await connect();
    let result = await db.collection("comments").insertOne(data)
    
    if(result && result.insertedCount == 1){
        res.json(result.ops[0])
    }
    else{
        res.json({
            status: "fail"
        });
    }
    
})

/**
 
app.get('/games/:id', (req, res) => {
    
    let id  = req.params.id
    console.log("Trazena je igra pod ID", id);
    res.json(storage.games.filter((x) => x.game_id == id));

});

*/



//comments
app.get('/Playlist', async (req, res) =>{
    let db = await connect()
    
    let cursor = await db.collection("playlist").find() 
    let results = await cursor.toArray()
    res.json(results)
    
})

//GTAV
app.post('/GtaVpl', async (req,res)=>{
    let data = req.body;

    delete data._id;

    let db = await connect();
    let result = await db.collection("playlist").insertOne(data)
    
    if(result && result.insertedCount == 1){
        res.json(result.ops[0])
    }
    else{
        res.json({
            status: "fail"
        });
    }
    
})
//Zelda
app.post('/Zeldapl', async (req,res)=>{
    let data = req.body;

    delete data._id;

    let db = await connect();
    let result = await db.collection("playlist").insertOne(data)
    
    if(result && result.insertedCount == 1){
        res.json(result.ops[0])
    }
    else{
        res.json({
            status: "fail"
        });
    }
    
})
//It Takes 2
app.post('/It_takes_2pl', async (req,res)=>{
    let data = req.body;

    delete data._id;

    let db = await connect();
    let result = await db.collection("playlist").insertOne(data)
    
    if(result && result.insertedCount == 1){
        res.json(result.ops[0])
    }
    else{
        res.json({
            status: "fail"
        });
    }
    
})

//ne
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