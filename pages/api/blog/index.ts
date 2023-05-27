import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { userInfo } from "os";

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
      const { id, action, userId, blogId } = req.query;

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
        let userInfo = [];
        console.log(userId);
        if (userId) {
          userInfo = await db
            .collection("users")
            .find({ _id: new ObjectId(userId as string) })
            .toArray();

          console.log(userInfo);
        }
        if (action === "MyBlogs") {
          blogsWithUserDetails = await db
            .collection("blogs")
            .aggregate([
              {
                $match: {
                  createdBy: new ObjectId(userId as string),
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
      }
      res.status(200).send({ blogs: blogsWithUserDetails, userInfo });
    } else if (req.method === "POST" || req.method === "PUT") {
      const {
        blogBanner,
        blogTitle,
        blogDescription,
        blogTags,
        createdBy,
        createdOn,
      } = req.body;

      if (req.method === "POST") {
        const result = await db.collection("blogs").insertOne({
          blogBanner,
          blogTitle,
          blogDescription,
          tags: blogTags,
          readingList: [],
          likeList: [],
          createdBy: new ObjectId(createdBy),
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
