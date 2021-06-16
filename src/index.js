import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connect from "./database.js";
import mongo from "mongodb";
import auth from "./auth.js";
import a_auth from "./a_auth.js";

const app = express(); // instanciranje aplikacije

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3100;

app.listen(port, function () {
	console.log("Server se slusa na portu", port);
});

//admins------------------------------------------------------------------------------------------------------------------------------------------
app.post("/admins", async (req, res) => {
	let admin = req.body;

	let id;
	try {
		id = await a_auth.registerUser(admin);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}

	res.json({ id: id });
});

app.get("/admins", async (req, res) => {
	let db = await connect();

	let cursor = await db.collection("admins").find();
	let results = await cursor.toArray();
	res.json(results);
});

app.get("/admins/:email", async (req, res) => {
	let db = await connect();
	let email = req.params.email;

	let results = await db.collection("admins").findOne({ email: email });

	res.json(results);
});
app.patch("/admins", [a_auth.verify], async (req, res) => {
	let changes = req.body;
	if (changes.new_password && changes.old_password) {
		let result = await a_auth.changeUserPassword(
			req.jwt.email,
			changes.old_password,
			changes.new_password
		);
		if (result) {
			res.status(201).send();
		} else {
			res.status(500).json({ error: "cannot change password" });
		}
	} else {
		res.status(400).json({ error: "unrecognized request" });
	}
});

app.get("/tajna", (req, res) => {
	res.json({ message: "Ovo je tajna " + req.jwt.email });
});

app.post("/a_auth", async (req, res) => {
	let admin = req.body;

	try {
		let result = await a_auth.authenticateUser(admin.email, admin.password);
		res.json(result);
	} catch (e) {
		return res.status(401).json({
			error: e.message,
		});
	}
});

//users------------------------------------------------------------------------------------------------------------------------------------------

app.post("/users", async (req, res) => {
	let user = req.body;

	let id;
	try {
		id = await auth.registerUser(user);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}

	res.json({ id: id });
});
app.patch("/users", [auth.verify], async (req, res) => {
	let changes = req.body;
	if (changes.new_password && changes.old_password) {
		let result = await auth.changeUserPassword(
			req.jwt.email,
			changes.old_password,
			changes.new_password
		);
		if (result) {
			res.status(201).send();
		} else {
			res.status(500).json({ error: "cannot change password" });
		}
	} else {
		res.status(400).json({ error: "unrecognized request" });
	}
});

app.get("/users", async (req, res) => {
	let db = await connect();

	let cursor = await db.collection("users").find();
	let results = await cursor.toArray();
	res.json(results);
});

app.get("/users/:email", async (req, res) => {
	let db = await connect();
	let email = req.params.email;

	let results = await db.collection("users").findOne({ email: email });

	res.json(results);
});

app.get("/tajna", [auth.verify], (req, res) => {
	res.json({ message: "Ovo je tajna " + req.jwt.email });
});

app.post("/auth", async (req, res) => {
	let user = req.body;

	try {
		let result = await auth.authenticateUser(user.email, user.password);
		res.json(result);
	} catch (e) {
		return res.status(401).json({
			error: e.message,
		});
	}
});

//games----------------------------------------------------------------------------------
app.get("/games/:id", [auth.verify], async (req, res) => {
	let id = req.params.id;
	let db = await connect();

	let doc = await db.collection("games").findOne({ _id: mongo.ObjectId(id) });
	res.json(doc);
});

app.get("/games", async (req, res) => {
	let db = await connect();
	let query = req.query;

	let selekcija = {};

	if (query.name) {
		selekcija.name = new RegExp(query.name);
	}

	if (query.name2) {
		let pretraga = query.name2;
		let terms = pretraga.split(" ");

		selekcija = {
			$and: [],
		};

		terms.forEach((term) => {
			//console.log("unutar petelje", term);
			let or = {
				$or: [{ name: new RegExp(term) }, { genre: new RegExp(term) }],
			};

			selekcija.$and.push(or);
		});
	}

	//console.log("selekcija", selekcija)

	let cursor = await db.collection("games").find(selekcija);
	let results = await cursor.toArray();

	res.json(results);
});

app.post("/games",  async (req, res) => {
	let data = req.body;

	delete data._id;

	let db = await connect();
	let result = await db.collection("games").insertOne(data);

	if (result && result.insertedCount == 1) {
		res.json(result.ops[0]);
	} else {
		res.json({
			status: "fail",
		});
	}
});

//PLAYLIST------------------------------------------------------------------------------------------------------------------------
app.get("/Playlist", [auth.verify], async (req, res) => {
	let db = await connect();

	let cursor = await db.collection("playlist").find();
	let results = await cursor.toArray();
	res.json(results);
});

app.post("/Playlist", [auth.verify], async (req, res) => {
	let data = req.body;

	delete data._id;

	let db = await connect();
	let result = await db.collection("playlist").insertOne(data);

	if (result && result.insertedCount == 1) {
		res.json(result.ops[0]);
	} else {
		res.json({
			status: "fail",
		});
	}
});

app.get("/Playlist/:author", [auth.verify], async (req, res) => {
	let db = await connect();
	let aut = req.params.author;

	let cursor = await db.collection("playlist").find({ author: aut });
	let results = await cursor.toArray();
	res.json(results);
});

app.get("/Playlist_c/:game_id", [auth.verify], async (req, res) => {
	let db = await connect();
	let gameId = req.params.game_id;

	let results = await db.collection("playlist").findOne({ game_id: gameId });
	res.json(results);
});

app.post("/Playlist/delete/:game_name", [auth.verify], async (req, res) => {
	let name = req.params.game_name;
	console.log(name);

	let db = await connect();
	let result = await db.collection("playlist").deleteOne({ game_name: name });

	if (result && result.deletedCount == 1) {
		res.json(result);
	} else {
		res.json({
			status: "fail",
		});
	}
});

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

//COMMENTS--------------------------------------------------------------------------------------------------------
app.get("/comments/:game_id", [auth.verify], async (req, res) => {
	let db = await connect();
	let gameId = req.params.game_id;

	let result = await db.collection("comments").find({ game_id: gameId });
	let cursor = await result.toArray();
	res.json(cursor);
});

app.post("/comments", [auth.verify], async (req, res) => {
	let data = req.body;

	delete data._id;

	let db = await connect();
	let result = await db.collection("comments").insertOne(data);

	if (result && result.insertedCount == 1) {
		res.json(result.ops[0]);
	} else {
		res.json({
			status: "fail",
		});
	}
});

app.post("/comments/delete/:comment", [auth.verify], async (req, res) => {
	let name = req.params.comment;
	console.log(name);

	let db = await connect();
	let result = await db.collection("comments").deleteOne({ comment: name });

	if (result && result.deletedCount == 1) {
		res.json(result);
	} else {
		res.json({
			status: "fail",
		});
	}
});
/**
app.patch("/GtaV/:id", [auth.verify], async (req, res) => {
	let id = req.params.id;
	let data = req.body;

	let db = await connect();
	let result = await db.collection("comments").updateOne(
		{ _id: mongo.ObjectID(id) },
		{
			$set: data,
		}
	);
	if (result && result.modifiedCount == 1) {
		let doc = await db.collection("comments").findOne({
			_id: mongo.ObjectID(id),
		});
		res.json(doc);
	} else {
		res.json({ status: "fail" });
	}
});
*/

app.post("/Contact", [auth.verify], async (req, res) => {
	let data = req.body;

	delete data._id;

	let db = await connect();
	let result = await db.collection("contact").insertOne(data);

	if (result && result.insertedCount == 1) {
		res.json(result.ops[0]);
	} else {
		res.json({
			status: "fail",
		});
	}
});
