import app from "./src/app.js";

const startServer = () => {
    const port = process.env.PORT || 3001

    app.listen(port, () => {
        console.log(`server is running at PORT: ${port}`)
    })
}


startServer()