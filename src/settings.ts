import  express from 'express'
import cors from 'cors'
import { blogsRouter } from './routers/blogs-router';
import { postsRouter } from './routers/posts-router';
import {testingRouter } from './routers/testing-router';


export const app = express()
const corsMiddleware = cors();
app.use(corsMiddleware)
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)



app.use('/blogs', blogsRouter)

app.use('/posts', postsRouter)

app.use('/testing', testingRouter)