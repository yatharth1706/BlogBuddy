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
        if (userId != "null" && userId != undefined && userId !== null) {
          userInfo = await db
            .collection("users")
            .find({ _id: new ObjectId(userId as string) })
            .toArray();
        }

        if (action === "MyBlogs") {
          if (userId != "null" && userId != undefined && userId !== null) {
            blogsWithUserDetails = await db
              .collection("blogs")
              .aggregate([
                {
                  $match: {
                    createdBy: new ObjectId(userId as string) ?? "",
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
                {
                  $sort: { createdOn: -1 }, // Sort in descending order based on createdOn field
                },
              ])
              .toArray();
          } else {
            blogsWithUserDetails = [];
          }
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
              {
                $sort: { createdOn: -1 }, // Sort in descending order based on createdOn field
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
          likeCount: 0,
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
