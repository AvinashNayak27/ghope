const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;
app.use(cors());

const { Network, Alchemy } = require("alchemy-sdk");

app.use(express.json()); // Middleware to parse JSON bodies

const settings = {
  apiKey: "eM_uI9dPBPrkULbHAWc6hMngDH_o769A",
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

const bcrypt = require("bcryptjs");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/courses");
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPro: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

// User registration
app.post("/register", async (req, res) => {
  try {
    let user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, "myPrivateKey"); // Use a more secure key in production
    res.send({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// User profile
app.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, "myPrivateKey");
    const user = await User.findOne({ _id: payload._id });
    res.send(user);
  } catch (error) {
    res.status(401).send({ message: "Not authorized" });
  }
});

app.post("/webhook", async (req, res) => {
  const { txHash, email } = req.body;

  try {
    const tx = await alchemy.core.getTransactionReceipt(txHash);

    // Accessing the data
    const transaction = tx.logs[0];
    const topics = transaction.topics;
    const data = transaction.data;

    // Converting data from hex to decimal
    function hexToDecimal(hexString) {
      return BigInt(hexString).toString(10);
    }

    const tokenAddress = transaction?.address;
    const from = `0x${topics[1].slice(26)}`;
    const to = `0x${topics[2].slice(26)}`;
    const value = hexToDecimal(data) / 10 ** 18;

    // Validation
    if (
      to.toLowerCase() === "0xffe6903b2709560ee232b3380dc210d0db486aa1" &&
      value === 10 &&
      tokenAddress.toLowerCase() ===
        "0xc4bf5cbdabe595361438f8c6a187bdc330539c60"
    ) {
      console.log(`Email: ${email}`);
      const user = await User.findOne({ email: email });
      user.isPro = true;
      await user.save();
      console.log("User updated");

      res.status(200).send("Webhook validated successfully!");
    } else {
      // Conditions are not met
      res.status(400).send("Validation failed!");
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`server is listening at http://localhost:${port}`);
});
