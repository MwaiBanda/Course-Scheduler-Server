import { Redis, RedisKey } from "ioredis";
import express from "express";
import cors from "cors"
import REDIS_URL from "./config/default";

const client = new Redis(REDIS_URL)

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({origin: '*'}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next();
});

app.get("/", (req, res) => {
  res.send("<h6>Group 3 backend</h6>")
})

app.get("/users", async (req, res) => {
  try {
    const users = await client.get("users")
    const response = JSON.parse(users) as User[]
    res.json(response ? response : []).status(200);
  } catch (error) {
    console.log(error)
  }

})

app.post('/users', async (req, res) => {
  try {
    const users = req.body as Course[]
    console.log("[POST]\n" + `${users.map((course) => {
      return course.courseName
    })}`)
    await client.set("users", JSON.stringify(users))
    res.json(users).status(200)
  } catch (error) {
    console.log(error)
  }
})

app.get("/courses", async (req, res) => {
  try {
    const courses = await client.get("courses")
    const response = JSON.parse(courses) as Course[]
    res.json(response ? response : []).status(200);
  } catch (error) {
    console.log(error)
  }
})

app.get("/courses/user/:Id", async (req, res) => {
  try {
    const user = req.params.Id
    const courses = await client.get(user)
    if (courses) {
      const response = JSON.parse(courses) as Course[]
      return res.json(response ? response : []).status(200);
    }
  } catch (error) {
    console.log(error)
  }
})


app.post('/courses', async (req, res) => {
  try {
    const courses = req.body as Course[]
    console.log("[POST]\n" + `${courses.map((course) => {
      return course.courseName
    })}`)
    await client.set("courses", JSON.stringify(courses))
    res.json(courses).status(200)
  } catch (error) {
    console.log(error)
  }
})

app.post("/courses/user/:Id", async (req, res) => {
  try {
    const user = req.params.Id
    const courses = req.body as Course[]
    await client.set(user, JSON.stringify(courses))
    res.json(courses).status(200)
  } catch (error) {
    console.log(error)
  }
})

app.get("/info/course/:Id", async (req, res) => {
  try {
    const courseId = req.params.Id
    const users = JSON.parse(await client.get('users')) as User[]
    let foundCourse: Course = null
    let enrolledCount = 0
    if (users) {
      console.log(courseId)
      for (const user of users) {
        const userCourses = JSON.parse(await client.get(user.username)) as Course[];
        if (userCourses) {
          const enrolledCourses = userCourses.filter(course => course.id === JSON.parse(courseId))
          enrolledCount += enrolledCourses.length;
          if (enrolledCourses.length > 0) {
            foundCourse = { ...userCourses.find(course => course.id === JSON.parse(courseId)),  ...{ numberOfEnrolledStudents: enrolledCount }}
          }
          console.log(`Students enrolled in Course: ${courseId} are : ${enrolledCount}`);
        }
      }
      return res.json({
        ...(foundCourse ? foundCourse : { 
            id: JSON.parse(courseId) as number,
            numberOfEnrolledStudents: enrolledCount,
            error: "Not information found (No Students Enrolled)" 
          }),
      }).status(200);
    }
  } catch (error) {
    console.log(error)
  }
})

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
})



