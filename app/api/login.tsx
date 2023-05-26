import { comparePasswords, generateJWT } from "@/lib/auth";
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

  const { email, password } = req.body;

  // Validate the input data
  if (!email || !password) {
    res.status(422).json({ message: "Invalid input" });
    return;
  }

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    // Find the user document based on the email
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      client.close();
      return;
    }

    // Compare the hashed password with the provided password
    const passwordsMatch = comparePasswords(password, user.password);
    if (!passwordsMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      client.close();
      return;
    }

    // Generate a JWT (you can use a library like jsonwebtoken for this)
    const token = generateJWT(user._id);

    res.status(200).json({ message: "Login successful", token });
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
