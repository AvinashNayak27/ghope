const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const cors = require("cors");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ghope");
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

// Define the PaymentID schema
const paymentIDSchema = new Schema({
  productName: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  token: { type: String, required: true },
  network: { type: String, required: true },
  uniquePaymentRef: { type: String, required: true, unique: true },
});

// Define the User schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true },
  paymentIDs: [paymentIDSchema], // Array of PaymentID documents
});

// Create models
const PaymentID = mongoose.model("PaymentID", paymentIDSchema);
const User = mongoose.model("User", userSchema);

const createUser = async (email, walletAddress) => {
  try {
    const user = new User({ email, walletAddress });
    await user.save();
    console.log("User created");
  } catch (error) {
    console.log(error);
  }
};

const createPaymentID = async (
  productName,
  owner,
  amount,
  token,
  network,
  uid
) => {
  try {
    const paymentID = new PaymentID({
      productName,
      owner,
      amount,
      token,
      network,
      uniquePaymentRef: uid,
    });
    await paymentID.save();
    await User.findByIdAndUpdate(owner, {
      $push: { paymentIDs: paymentID },
    });
    return paymentID;
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log(error);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return user;
    } else {
      console.log("No user found with that email.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

const getPaymentIDsByUser = async (user) => {
  try {
    const paymentIDs = await PaymentID.find({ owner: user._id });
    return paymentIDs;
  } catch (error) {
    console.log(error);
  }
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create-user", async (req, res) => {
  const { email, walletAddress } = req.body;
  await createUser(email, walletAddress);
  res.send("User created");
});

app.post("/create-payment-id", async (req, res) => {
  const { productName, owner, amount, token, network, uid } = req.body;
  const paymentID = await createPaymentID(
    productName,
    owner,
    amount,
    token,
    network,
    uid
  );
  res.send(paymentID)
});

app.get("/users", async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

app.get("/user-by-email", async (req, res) => {
  const { email } = req.query;
  const user = await getUserByEmail(email);
  res.send(user);
});

app.get("/payment-ids-by-user", async (req, res) => {
  const { email } = req.query;
  const user = await getUserByEmail(email);
  const paymentIDs = await getPaymentIDsByUser(user);
  res.send(paymentIDs);
});

app.get("/payment-id", async (req, res) => {
  const { uid } = req.query;
  const paymentID = await PaymentID.findOne({ uniquePaymentRef: uid });
  res.send(paymentID);
});
app.listen(3000, () => console.log("Server running on port 3000"));
