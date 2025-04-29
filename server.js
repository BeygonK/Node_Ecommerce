// Description: This is the entry point for the backend server. It imports the app from app.js and starts the server on a specified port.
// Importing the app from app.js and dotenv for environment variable management

import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
