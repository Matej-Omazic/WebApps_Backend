import mongo from "mongodb";
import connect from "./database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

(async () => {
	let db = await connect();
	await db.collection("users").createIndex({ email: 1 }, { unique: true });
})();

export default {
	async registerUser(userData) {
		let db = await connect();

		let doc = {
			email: userData.email,
			username: userData.username,
			password: await bcrypt.hash(userData.password, 8),
		};

		try {
			let result = await db.collection("users").insertOne(doc);
			if (result && result.insertedId) {
				return result.insertedId;
			}
		} catch (e) {
			if (e.name == "MongoError" && e.code == 11000) {
				throw new Error("Korisnik vec postoji");
			}
		}
	},

	async authenticateUser(email, password) {
		let db = await connect();
		let user = await db.collection("users").findOne({ email: email });

		if (
			user &&
			user.password &&
			(await bcrypt.compare(password, user.password))
		) {
			delete user.password; // ne želimo u tokenu, token se sprema na klijentu
			let token = jwt.sign(user, process.env.JWT_SECRET, {
				algorithm: "HS512",
				expiresIn: "1 week",
			});
			return {
				token,
				email: user.email,
			};
		} else {
			throw new Error("Cannot authenticate");
		}
	},
	async changeUserPassword(email, old_password, new_password) {
		let db = await connect();
		let user = await db.collection("users").findOne({ email: email });
		if (
			user &&
			user.password &&
			(await bcrypt.compare(old_password, user.password))
		) {
			let new_password_hashed = await bcrypt.hash(new_password, 8);
			let result = await db
				.collection("users")
				.updateOne(
					{ _id: user._id },
					{ $set: { password: new_password_hashed } }
				);
			return result.modifiedCount == 1;
		}
	},

	verify(req, res, next) {
		try {
			let authorization = req.headers.authorization.split(" ");
			let type = authorization[0];
			let token = authorization[1];
			//console.log(type, token)

			if (type !== "Bearer") {
				res.status(401).send();
				return false;
			} else {
				req.jwt = jwt.verify(token, process.env.JWT_SECRET);
				return next();
			}
		} catch (e) {
			return res.status(401).send();
		}
	},
};
