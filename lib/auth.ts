import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { ObjectId } from "mongodb";

// Function to hash the password
const hashPassword = (password: string) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

// Function to compare the hashed password with the provided password
const comparePasswords = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

// Function to generate a JSON Web Token (JWT)
const generateJWT = (userId: ObjectId) => {
  const expiresIn = "2d"; // Token expiration time

  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn,
    issuer: "BlogBuddy",
  });
  return token;
};

function tokenIsValid(token: string) {
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Check if the token has the correct issuer
    if (decodedToken.iss !== "BlogBuddy") {
      return false; // Token is not issued by your app
    }

    // Check if the token has expired
    if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
      return false; // Token has expired
    }

    return true; // Token is valid
  } catch (error) {
    return false; // Token is invalid or expired
  }
}

export { comparePasswords, generateJWT, hashPassword, tokenIsValid };
