import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
  const secretKey = "your-secret-key"; // Replace with your own secret key
  const expiresIn = "1h"; // Token expiration time

  const token = jwt.sign({ userId }, secretKey, { expiresIn });
  return token;
};

export { comparePasswords, generateJWT, hashPassword };
