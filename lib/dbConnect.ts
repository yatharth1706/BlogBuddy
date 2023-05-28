// utils/dbConnect.js

import mongoose, { ConnectOptions, ConnectionStates } from "mongoose";

type ConnectionType = {
  isConnected?: ConnectionStates;
};

const connection: ConnectionType = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );

    connection.isConnected = db.connections[0].readyState;
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}

export default dbConnect;
