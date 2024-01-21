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
    await mongoose.connect("mongodb+srv://bablu:J9WLADsG4uycd0C2@cluster0.n4sxtlq.mongodb.net/?retryWrites=true&w=majority");
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

const transactionSchema = new mongoose.Schema({
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  isClaimed: {
    type: Boolean,
    default: false,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// User registration
app.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }
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

  // Check for missing fields
  if (!txHash || !email) {
    return res.status(400).send("Missing transaction hash or email");
  }

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Fetch transaction receipt
    const tx = await alchemy.core.getTransactionReceipt(txHash);
    if (!tx) {
      return res.status(404).send("Transaction not found");
    }

    // Accessing the data
    const transaction = tx.logs[0];
    if (!transaction) {
      return res.status(400).send("Transaction logs not found");
    }

    const { topics, data, address: tokenAddress } = transaction;

    // Converting data from hex to decimal
    const hexToDecimal = (hexString) => BigInt(hexString).toString(10);

    const from = `0x${topics[1].slice(26)}`;
    const to = `0x${topics[2].slice(26)}`;
    const value = hexToDecimal(data) / 10 ** 18;

    // Validation
    if (
      value === 10 &&
      tokenAddress.toLowerCase() === "0xc4bf5cbdabe595361438f8c6a187bdc330539c60"
    ) {
      console.log(`Email: ${email}`);

      let transaction = await Transaction.findOne({ txHash: txHash });
      if (!transaction) {
        transaction = new Transaction({ txHash: txHash });
      }

      if (!transaction.isClaimed) {
        user.isPro = true;
        await user.save();
        console.log("User updated");

        transaction.isClaimed = true;
        await transaction.save();
        console.log("Transaction updated");

        return res.status(200).send("Webhook validated successfully!");
      } else {
        return res.status(200).send("Transaction already claimed");
      }
    } else {
      // Conditions are not met
      return res.status(400).send("Validation failed!");
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
  console.log(`server is listening at http://localhost:${port}`);
});
