import express from "express";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const app = express();
const PORT = 4000;

//connecting MongoDb___________________
const MONGO_URL =
  "mongodb+srv://raghutwo:welcome123@cluster0.4gd3qjn.mongodb.net/";
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("mongo connected");
//_____________________________________

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
        { $group: { _id: "$genres", movies: { $push: "$$ROOT" } } },
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
