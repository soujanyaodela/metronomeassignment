const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newline characters
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40login-auth-f5729.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore database reference
const db = admin.firestore();

const app = express();
app.use(express.json()); // Middleware for parsing JSON
app.use(cors()); // Enable Cross-Origin Resource Sharing

// POST: Create a new item
app.post("/items", async (req, res) => {
  try {
    const { title, description, image, rating } = req.body;

    if (!title || !description || !image || !rating) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Add item to Firestore
    const newItem = { title, description, image, rating };
    const docRef = await db.collection("items").add(newItem);

    res.status(201).json({ id: docRef.id, ...newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all items
app.get("/items", async (req, res) => {
  try {
    const snapshot = await db.collection("items").get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update an existing item by ID
app.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, rating } = req.body;

    if (!title || !description || !image || !rating) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const itemRef = db.collection("items").doc(id);
    await itemRef.update({ title, description, image, rating });

    res.json({ message: "Item updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Delete an item by ID
app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("items").doc(id).delete();
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Generate custom Firebase Auth token (for authentication)
app.post("/generateToken", async (req, res) => {
  const { uid } = req.body;

  if (!uid) return res.status(400).json({ error: "UID is required" });

  try {
    const token = await admin.auth().createCustomToken(uid);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});