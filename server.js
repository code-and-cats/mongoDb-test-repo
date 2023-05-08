import express from "express";
import cors from "cors";
import mongoose from 'mongoose'

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
if (mongoose.connection.readyState === 1) {
  next() 
} else {
  res.status(503).json({error: 'service unavailable'})
}
})

// const mongoUrl = process.env.MONGO_URL || mongoose.connect("mongodb://127.0.0.1:27017");
mongoose.connect("mongodb://127.0.0.1", { useNewUrlParser : true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Animal = mongoose.model('Animal', {
  name: String,
  age: Number,
  isFurry: Boolean
})

Animal.deleteMany().then(() => {
new Animal({ name: 'Bullen', age: 4, isFurry: true }).save()
new Animal({ name: 'Popcorn', age: 3, isFurry: true }).save()
new Animal({ name: 'Seal', age: 2, isFurry: true }).save()
})

// Start defining your routes here
app.get("/", (req, res) => {
  Animal.find().then(animals => {
    res.json(animals)
  })
});

app.get('/:name', async (req, res) => {
try {Animal.findOne({name: req.params.name}).then((animal) => {
    if(animal) {
      res.json(animal)
    } else {
      res.status(404).json({ error: 'Not found!' })
    }
  })
} catch (err) {
  res.status(400).json({error: 'Invalid request!'})
}
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
