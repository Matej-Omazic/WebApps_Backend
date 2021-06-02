import dotenv from "dotenv"
dotenv.config();

import express from 'express';
import storage from './storage';
import cors from 'cors';
import connect from './database'
import mongo from 'mongodb'
import auth from './auth'

const app = express(); // instanciranje aplikacije
const port = 3000; // port na kojem će web server slušati

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Slušam na portu ${port}!`))




//users------------------------------------------------------------------------------------------------------------------------------------------
app.get('/user', (req, res) => res.send(storage.user))


app.get('/tajna', [auth.verify], (req, res) => {
 
    res.json({message: "Ovo je tajna " + req.jwt.username});

})

app.post('/auth', async (req, res) => {
    let user = req.body;

    try {
        let result = await auth.authenticateUser(user.username, user.password);
        res.json(result);
    } catch (e) {
        res.status(401).json({
            error: e.message,
        });
    }
});

app.post('/users', async (req, res) => {
    let user = req.body;

    let id;
    try {
        id = await auth.registerUser(user);
     }
    catch(e){
        res.status(500).json({error: e.message});
    }


    res.json({id: id})
})





//games----------------------------------------------------------------------------------
app.get('/games/:id', async (req, res) =>{
    let id = req.params.id;
    let db = await connect();

    let doc = await db.collection("games").findOne({_id: mongo.ObjectId(id)})
    res.json(doc)
})


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

//GTAV COMMENTS--------------------------------------------------------------------------------------------------------
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


//Zelda COMMENTS------------------------------------------------------------------------------------------------------------------------
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

//It takes 2 COMMENTS-------------------------------------------------------------------------------------------------------------------------
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



//playlist------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/Playlist', async (req, res) =>{
    let db = await connect()
    
    let cursor = await db.collection("playlist").find() 
    let results = await cursor.toArray()
    res.json(results)
    
})

//GTAV PLAYLIST------------------------------------------------------------------------------------------------------------------------
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
//Zelda PLAYLIST------------------------------------------------------------------------------------------------------------------------
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
//It Takes 2 PLAYLIST------------------------------------------------------------------------------------------------------------------------
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



app.get('/comments', (req, res) => res.send(storage.comments))
