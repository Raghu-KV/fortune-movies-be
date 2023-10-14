import express from "express";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import cors from "cors";
import * as dotenv from "dotenv";
import { auth } from "./middleware/auth.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;
//connecting MongoDb___________________
const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("mongo connected");
//_____________________________________

app.use(cors());
app.use(auth);

app.get("/", (req, res) => {
  try {
    res.send({ message: "express working" });
  } catch (error) {
    res.json(error);
  }
});

app.get("/movies", async (req, res) => {
  try {
    const allMovies = await client
      .db("fortune")
      .collection("movies")
      .aggregate([
        { $unwind: "$genres" },
        {
          $group: {
            _id: "$genres",
            movies: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 1,
            movies: {
              _id: 1,
              director: 1,
              imdb_rating: 1,
              length: 1,
              backdrop: 1,
              title: 1,
              slug: 1,
            },
          },
        },
      ])
      .toArray();
    console.log(allMovies);

    res.send(allMovies);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//get single movie by id
app.get("/movies/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const singleMovies = await client
    .db("fortune")
    .collection("movies")
    .findOne({ _id: new ObjectId(id) });
  res.send(singleMovies);
});

app.listen(PORT, () => console.log(`listening in port ${PORT}`));
