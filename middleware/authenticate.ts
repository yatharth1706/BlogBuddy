import { tokenIsValid } from "@/lib/auth";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default function authenticate(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
) {
  const token = req?.headers?.authorization; // Assuming you're using cookies to store the token

  // Perform token validation logic here
  if (tokenIsValid(token as string)) {
    // Token is valid, allow the request to proceed
    next(req, res);
  } else {
    // Token is invalid, respond with an error
    res.status(401).json({ error: "Invalid token / User is not authorized" });
  }
}
