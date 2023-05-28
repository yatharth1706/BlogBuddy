import authenticate from "@/middleware/authenticate";
import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // connect to mongo

    authenticate(req, res, async () => {
      const client = await MongoClient.connect(
        process.env.MONGODB_URI as string
      );
      const db = client.db();

      // create a blog collection
      if (req.method === "PUT") {
        const { userId, followUserId } = req.body;

        if (!userId) {
          res
            .status(400)
            .send({ message: "User must be logged in to follow other users" });
        }

        const user = await db
          .collection("users")
          .findOne({ _id: new ObjectId(userId) });

        const followObjectId = new ObjectId(followUserId);

        if (
          user?.followList?.some((followId: ObjectId) =>
            followId.equals(followObjectId)
          )
        ) {
          await db
            .collection("users")
            .updateOne(
              { _id: new ObjectId(userId) },
              { $pull: { followList: followObjectId } }
            );
        } else {
          await db
            .collection("users")
            .updateOne(
              { _id: new ObjectId(userId) },
              { $addToSet: { followList: followObjectId } }
            );
        }

        res.status(200).send({ message: "Followed / unfollowed successfully" });
      }

      client.close();
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " + String(err) });
  }
}
