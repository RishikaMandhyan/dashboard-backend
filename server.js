require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Transaction = require("./models/transactions");
const Order = require("./models/order");
const Product = require("./models/product");
const User = require("./models/user");

const app = express();

const {
  salesGraph,
  ordersGraph,
  platformGraph,
  categoryGraph,
  inventory,
  dummyOrders,
} = require("./data.js");

app.use(
  cors({
    origin: true,
    methods: ["GET", "PUT", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
  //insertData();
});

// async function insertData() {
//   try {

//     console.log(dummyOrders);
//     await Order.create(dummyOrders);
//     console.log('Document inserted successfully');
//   } catch (error) {
//     console.error('Error inserting document:', error);
//   } finally {

//   }
// }

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) res.status(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    if (err) res.status(403);
    req.user = user;
    next();
  });
  //in the jwt.verify, we have sent a callback fucntion with err and user, here user is the payload data
  //obtained from the token given inside jwt.verify
};

app.get("/transactions/:page", authenticateUser, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .limit(15)
      .skip((req.params.page - 1) * 15);
    const total = await Transaction.countDocuments({});
    const resp = { list: transactions, total };
    res.json(resp);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/orders/:page", authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find()
      .limit(10)
      .skip((req.params.page - 1) * 15);
    const total = await Order.countDocuments({});
    const resp = { list: orders, total };
    res.json(resp);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/sales-analytics", authenticateUser, (req, res) => {
  res.status(200).json(salesGraph);
});

app.get("/orders-analytics", authenticateUser, (req, res) => {
  res.status(200).json(ordersGraph);
});

app.get("/platform-analytics", authenticateUser, (req, res) => {
  res.status(200).json(platformGraph);
});

app.get("/category-analytics", authenticateUser, (req, res) => {
  res.status(200).json(categoryGraph);
});

app.get("/inventory", authenticateUser, async (req, res) => {
  try {
    const inventory = await Product.find();
    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/orders", authenticateUser, async (req, res) => {
  const tempItems = req.body.items.map((item) => {
    return {
      itemId: item._id,
      quantity: item.quantity,
    };
  });

  try {
    await Order.insertMany([
      { buyer: req.body.buyer, price: req.body.orderTotal, items: tempItems },
    ]);

    res.status(200).json("Order added");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/inventory/new", authenticateUser, async (req, res) => {
  try {
    await Product.insertMany([
      {
        name: req.body.name,
        maxQuantity: req.body.maxQuantity,
        price: req.body.price,
      },
    ]);
    res.status(200).json("Item added to inventory");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/inventory/:id", authenticateUser, async (req, res) => {
  try {
    const item = await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          maxQuantity: req.body.maxQuantity,
          price: req.body.price,
        },
      }
    );
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/inventory/:id", authenticateUser, async (req, res) => {
  try {
    const item = await Product.findOne({ _id: req.params.id });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json(err);
  }
});

let rTokens = []; //temporary db
let users = [
  {
    username: "rishika",
    password: "$2b$04$x4s2IkaQ3B8leRiJVHGPZ.05mOpzLcAV.pKz3h7Pq2fAcm7uVhnci", //'123'
  },
  {
    username: "rishika23",
    password: "$2b$04$JEsaMYnVGOQs2obXq0BsL.Gs.mVIkTjx3tzbjGtOWufLueergtrF2", //"12345"
  },
]; //temporary db

app.post("/signup", async (req, res) => {
  try {
    //first we will check if this user email already exists in db, if so
    //we will ask user to login instead
    //if email is unique, we can proceed further

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    console.log(req.body);
    const refreshTokens = [];

    const hashedPassword = await bcrypt.hash(password, 1);
    // console.log(hashedPassword);
    const user = { username: username, password: hashedPassword };
    users.push({ ...user });

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "30d",
    });

    rTokens.push(refreshToken);
    refreshTokens.push(refreshToken);
    console.log(refreshTokens);

    const temp = {
      username: username,
      email: email,
      password: hashedPassword,
      rTokens: refreshTokens,
    };
    console.log(temp);

    await User.insertMany([temp]);

    // res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, 
    { 
      httpOnly: true ,
      secure: true, // Make sure to set this for HTTPS
      sameSite: 'None',
    });
    res.status(201).json({ accessToken: accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/login", async (req, res) => {
  //console.log(await bcrypt.hash("123", 1));

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  console.log(req.body);
  const flag = users.find((item) => item.username === username); //db
  console.log(flag);

  const item = await User.findOne({ email: email });

  if (item == null) return res.status(404).json("Cannot find user");
  //flag is userinfo from db

  //console.log(bcrypt.compare(password, item?.password));
  try {
    if (await bcrypt.compare(password, item.password)) {
      const user = { username: username, password: password };

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: "10s",
      });
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY, {
        expiresIn: "30d",
      });

      const refreshTokens = item?.rTokens;
      rTokens.push(refreshToken);
      refreshTokens.push(refreshToken);
      console.log(rTokens);
      console.log(refreshToken);

      await User.updateOne(
        { email: email },
        {
          $set: {
            rTokens: refreshTokens,
          },
        }
      );

      // res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken,
       {httpOnly: true,
        secure: true, // Make sure to set this for HTTPS
        sameSite: 'None',
      });
      res.json({ accessToken: accessToken });
    } else {
      res.status(401).json("Password Incorrect");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//this route is called when we are sending a refresh token and need another access token
app.post("/token", async (req, res) => {
  const email = req.body.email;
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) res.status(401).json("Unauthorized");
    const item = await User.findOne({ email: email });

    if (!item?.rTokens?.includes(refreshToken))
      res.status(403).json("Unauthorized");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
      //console.log(user); //this user will contain username passowrd the data we used as payload
      //and some more info like iat(issued at) and exp (expiry) which we dont want to use as payload
      //when we get our access token

      if (err) res.status(403).json("Unauthorized");
      const accessToken = jwt.sign(
        { username: user.username, password: user.password },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: "20s" }
      );
      // res.cookie("refreshToken", refreshToken, { httpOnly: true });
      res.status(200).json({ accessToken: accessToken });
    });
  } catch (err) {
    res.status(500).json(err);
  }

  // console.log("rtoken", refreshToken);

  // if (!rTokens.includes(refreshToken)) res.status(403); //from db
});

app.delete("/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401);
  rTokens = rTokens.filter((item) => item !== refreshToken); //deleting from db

  res.clearCookie("refreshToken");
  res.json("Cookies cleared");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Main Server running on 3000");
});
