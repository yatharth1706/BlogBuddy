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
        const { userId, blogId } = req.body;

        if (!userId) {
          res
            .status(400)
            .send({ message: "User must be logged in to like the blog" });
        }

        const user = await db
          .collection("users")
          .findOne({ _id: new ObjectId(userId) });

        const blogObjectId = new ObjectId(blogId);

        if (
          user?.likeList?.some((readingId: ObjectId) =>
            readingId.equals(blogObjectId)
          )
        ) {
          await db
            .collection("users")
            .updateOne(
              { _id: new ObjectId(userId) },
              { $pull: { likeList: blogObjectId } }
            );

          await db
            .collection("blogs")
            .updateOne({ _id: blogObjectId }, { $inc: { likeCount: -1 } });
        } else {
          await db
            .collection("users")
            .updateOne(
              { _id: new ObjectId(userId) },
              { $addToSet: { likeList: blogObjectId } }
            );
          await db
            .collection("blogs")
            .updateOne({ _id: blogObjectId }, { $inc: { likeCount: 1 } });
        }

        res.status(200).send({ message: "Liked / Unliked successfully" });
      }

      client.close();
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " + String(err) });
  }
}
