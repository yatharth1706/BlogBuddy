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

    if (req.method === "GET") {
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
  if (req.query.id != null && req.query.id !== "" && req.query.id !== "null") {
    const userId = new ObjectId(req.query.id as string);
    const result = await db.collection("users").findOne({ _id: userId });

    const blogs = await db
      .collection("blogs")
      .aggregate([
        {
          $match: {
            _id: { $in: result?.readingList ?? [] },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
      ])
      .toArray();

    res.status(200).send({ readingList: blogs });
  } else {
    res.status(200).send({ readingList: [] });
  }
}
