import { generateJWT, hashPassword } from "@/lib/auth";
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { name, email, password } = req.body;

  // Validate the input data
  if (!name || !email || !password) {
    res.status(422).json({ message: "Invalid input" });
    return;
  }

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    // Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      res.status(422).json({ message: "User already exists" });
      client.close();
      return;
    }

    // Hash the password (you can use a library like bcrypt for this)
    const hashedPassword = hashPassword(password);

    // Create a new user document
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateJWT(result.insertedId);

    res
      .status(201)
      .json({ message: "User created", id: result.insertedId, token: token });
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
