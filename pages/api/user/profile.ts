import { Db, MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    if (req.method === "PUT") {
      // Update the user profile
      await PUT(req, res, db);
    } else if (req.method === "GET") {
      await GET(req, res, db);
    } else {
      res.status(405).send({ message: "Method not allowed" });
    }

    client.close();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + String(error) });
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse, db: Db) {
  if (req.query.id) {
    const userId = new ObjectId(req.query.id as string);
    const result = await db.collection("users").findOne({ _id: userId });

    res.status(200).send({ user: result });
  } else {
    const result = await db.collection("users").find().toArray();

    res.status(200).send({ users: result });
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse, db: Db) {
  const { name, email, bio, pic } = req.body;
  console.log(req.body);
  const id = new ObjectId(req?.query?.id as string);

  const result = await db.collection("users").updateOne(
    { _id: id },
    {
      $set: {
        name,
        bio,
        email,
        pic,
      },
    }
  );

  res.status(200).json({ message: "User profile updated" });
}
