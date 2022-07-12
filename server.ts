import express from 'express';
import * as dotenv from "dotenv"
dotenv.config()
import PostsRouter from './src/posts'
import UserRouter, {authcheck} from './src/users'

const app = express();

//Middlewares
app.use(authcheck)
app.use(express.json())
app.use('/users/', UserRouter)
app.use('/posts/', PostsRouter)


app.listen(process.env.PORT, () => {
    console.log(`The application is listening on port ${process.env.PORT}`);
})

