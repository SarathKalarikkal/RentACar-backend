import express from "express";
import apiRouter from "./routes/index.js";
import {PORT} from "./config/variables.js" 
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser"

import cors from "cors"

const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials : true
}))

app.use(express.json())
app.use(cookieParser())

connectDB()



app.use('/api', apiRouter)


app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`)
})
