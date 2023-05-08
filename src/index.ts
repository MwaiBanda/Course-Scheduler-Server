import { Redis } from "ioredis";
import express from "express";
import cors from "cors"
import REDIS_URL from "./config/default";

const client = new Redis(REDIS_URL)

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
});

app.get("/", (req, res) => {
  res.send("<h6>Group 3 backend</h6>")
})

app.get( "/users", async ( req, res ) => {
  try {
    const users = await client.get("users")
    res.json(JSON.parse(users)).sendStatus(200);
  } catch (error) {
    res.sendStatus(500).json(error.message)
  }
    
})

app.post('/users', async (req, res) => {
  try {
    const users = req.body as any[]
    console.log("[POST]\n" + `${users.map((course) => {
      return course.name
    })}`)
    await client.set("users", JSON.stringify(users))
    res.json(users).sendStatus(200)
  } catch (error) {
    res.sendStatus(500).json(error.message)
  }
})

app.get( "/courses", async ( req, res ) => {
  try {
    const courses = await client.get("courses")
    res.json(JSON.parse(courses)).sendStatus(200);
  } catch (error) {
    res.sendStatus(500).json(error.message)
  }
})

app.post('/courses', async (req, res) => {
  try {
    const courses = req.body as any[]
    console.log("[POST]\n" + `${courses.map((course) => {
      return course.name
    })}`)
    await client.set("courses", JSON.stringify(courses))
    res.json(courses).sendStatus(200)
  } catch (error) {
    res.sendStatus(500).json(error.message)
  }
})

app.listen( PORT, () => {
    console.log( `server started at http://localhost:${ PORT }` );
})