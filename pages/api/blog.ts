import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // connect to mongo

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    // create a blog collection
    if (req.method === "GET") {
      const { id, action } = req.query;

      if (action === "MyBlogs") {
        const user = await db
          .collection("users")
          .findOne({ _id: new ObjectId(id as string) });
        const blogs = await db
          .collection("blogs")
          .find({ createdBy: new ObjectId(id as string) })
          .toArray();
        res.status(200).send({ blogs, user });
      } else {
        const { blogId } = req.query;
        let blogsWithUserDetails = {};
        if (blogId) {
          blogsWithUserDetails = await db
            .collection("blogs")
            .aggregate([
              {
                $match: {
                  _id: new ObjectId(blogId as string),
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
        } else {
          blogsWithUserDetails = await db
            .collection("blogs")
            .aggregate([
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
        }
        res.status(200).send({ blogs: blogsWithUserDetails });
      }
    } else if (req.method === "POST" || req.method === "PUT") {
      const { blogBanner, blogTitle, blogDescription, createdBy, createdOn } =
        req.body;

      if (req.method === "POST") {
        const result = await db.collection("blogs").insertOne({
          blogBanner,
          blogTitle,
          blogDescription,
          createdBy,
          createdOn,
        });

        res.status(201).json({ message: "Blog Published Successfully" });
      }
    } else {
    }

    client.close();
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " + String(err) });
  }
}
