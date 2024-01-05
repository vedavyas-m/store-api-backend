require("dotenv").config();

// async errors
require("express-async-errors");
const express = require("express");
const app = express();

// Not found
const notFoundMiddleWare = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send(`<h1>Store API</h1> <a href="/api/v1/products">products route</a>`);
});

app.use("/api/v1/products", productsRouter);
// products route

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    // connect to db
    await connectDB(process.env.MONGO_URI);
    app.listen(port, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log(`server is listening port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
