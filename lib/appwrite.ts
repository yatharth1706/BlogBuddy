import { Client, ID, Storage } from "appwrite";

const client = new Client();

const storage = new Storage(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(process.env.PROJECT_ID as string); // Your project ID

export const storeFile = async () => {
  try {
    const uploader = document.getElementById(
      "uploader"
    ) as HTMLInputElement | null;
    if (!uploader) {
      throw new Error("Uploader element not found");
    }

    const file = uploader.files?.[0];
    if (!file) {
      throw new Error("No file selected");
    }

    const promise = await storage.createFile(
      process.env.BUCKET_ID as string,
      ID.unique(),
      file
    );

    return promise;
  } catch (err) {
    alert(err);
  }
};

export const getFilePreview = async (fileId: string) => {
  try {
    const promise = await storage.getFilePreview(
      process.env.BUCKET_ID as string,
      fileId
    );

    return promise;
  } catch (err) {
    alert(err);
  }
};
