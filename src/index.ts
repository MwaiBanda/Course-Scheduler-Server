import { Redis } from "ioredis";
import express from "express";

const client = new Redis("redis://default:655d0d20b9b1449683b4c37d59cd35ae@loyal-sloth-32673.upstash.io:32673")

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h6>Group 3 backend</h6>")
})


app.get( "/courses", async ( req, res ) => {
    const courses = await client.get("courses") ?? "[]"
    res.json(JSON.parse(courses));
})


app.post('/courses', async (req, res) => {
    const courses = req.body
    console.log("POST")
    console.log(courses)
    // await client.set("courses", JSON.stringify(courses))
    await client.set("users", JSON.stringify([
        {
            username: "jsmith69",
            password: "12345",
            account: "student"
        },
        {
            username: "bdole88",
            password: "f4nny",
            account: "teacher"
        },
        {
            username: "hli16",
            password: "lewisM@S",
            account: "teacher"
        }
    ]))

})
app.listen( PORT, () => {
    console.log( `server started at http://localhost:${ PORT }` );
})