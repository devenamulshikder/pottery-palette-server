const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shu503b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    const potteryCollectin = client.db("potteryDB").collection("pottery");
    const challangeCollection = client
      .db("potteryDB")
      .collection("challanging");

    app.get("/pottery", async (req, res) => {
      const cursor = potteryCollectin.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/challanging", async (req, res) => {
      const cursor = challangeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/pottery/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await potteryCollectin.findOne(query);
      res.send(result);
    });

    app.get("/challanging/:subcategory_name", async (req, res) => {
      const subcategoryName = req.params.subcategory_name;
      const query = potteryCollectin.find({
        subcategory_name: subcategoryName,
      });
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/myartcraftlist/:email", async (req, res) => {
      const email = req.params.email;
      const query = potteryCollectin.find({ userEmail: email });
      const result = await query.toArray();
      res.send(result);
    });

    app.post("/pottery", async (req, res) => {
      const newPottery = req.body;
      const result = await potteryCollectin.insertOne(newPottery);
      res.send(result);
    });

    // updated
    app.put("/pottery/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const craft = {
        $set: {
          item_name: updatedCraft.item_name,
          subcategory_name: updatedCraft.subcategory_name,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customizable: updatedCraft.customizable,
          image: updatedCraft.image,
          stock: updatedCraft.stock,
          processing_time: updatedCraft.processing_time,
          description: updatedCraft.description,
        },
      };

      const result = await potteryCollectin.updateOne(filter, craft, options);
      res.send(result);
    });

    app.delete("/pottery/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await potteryCollectin.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`server  is running on this port: ${port}`);
});
