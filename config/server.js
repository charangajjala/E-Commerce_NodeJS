import mongoConnect from "./db.js";

const port = 3000;
/**
 * Starts the server and listens for incoming requests.
 * @param {Object} app - The Express app instance.
 * @returns {Promise} - A Promise that resolves when the server is started successfully.
 * @throws {Error} - If an error occurs while starting the server.
 */
export default async function createServer(app) {
  try {
    await mongoConnect();
    app.listen(port, () => {
      console.log("Server is Listening");
    });
  } catch (error) {
    throw error;
  }
}
