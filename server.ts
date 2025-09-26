import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/database.js";

const startServer = async () => {

   // connect database
   await connectDB()

    const port = config.port || 3001

    app.listen(port, () => {
        console.log(`server is running at PORT: ${port}`)
    })
}


startServer()