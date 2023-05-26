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

  const { name, email, bio } = req.body;

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    // Update the user profile
    const result = await db.collection("users").updateOne(
      { email },
      {
        $set: {
          name,
          bio,
        },
      }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "User profile updated" });
    } else {
      res.status(404).json({ message: "User not found" });
    }

    client.close();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
