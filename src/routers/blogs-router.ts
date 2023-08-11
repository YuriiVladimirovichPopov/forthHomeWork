import {Request, Response, Router } from "express";
import { blogService} from "../domain/blog-service"
import { sendStatus } from "./send-status";
import { authorizationValidation,
          inputValidationErrors } from "../middlewares/input-validation-middleware";
import { CreateBlogValidation, UpdateBlogValidation } from "../middlewares/validations/blogs.validation";
import { RequestWithParams, RequestWithBody } from '../types';
import { BlogInputModel } from "../models/blogs/blogsInputModel";
import { getByIdParam } from "../models/getById";
import { BlogViewModel } from '../models/blogs/blogsViewModel';

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const allBlogs = await blogService.findAllBlogs()
    
    res.status(sendStatus.OK_200).send(allBlogs);
  })
  
blogsRouter.post('/',
  authorizationValidation,
  ...CreateBlogValidation,
  async (req: RequestWithBody<BlogViewModel>, res: Response<BlogViewModel>) => {
  
  const newBlog = await blogService.createBlog(req.body) 
  
  res.status(sendStatus.CREATED_201).send(newBlog)
})
  

blogsRouter.get('/blogs/{blogId}/posts', 

async (req: Request, res: Response) => {   })


blogsRouter.post('/blogs/{blogId}/posts', 

async (req: Request, res: Response) => {   })


blogsRouter.get('/:id', async (req: RequestWithParams<getByIdParam>, res: Response<BlogViewModel>) => {
    const foundBlog = await blogService.findBlogById(req.params.id)
    if (foundBlog) {
      res.status(sendStatus.OK_200).send(foundBlog)
    } else {
      res.sendStatus(sendStatus.NOT_FOUND_404)
    }
  })



blogsRouter.put('/:id',
  authorizationValidation,
  ...UpdateBlogValidation,
async (req: Request<getByIdParam, BlogInputModel>, res: Response<BlogViewModel>) => {
  
  const updateBlog = await blogService.updateBlog(req.params.id, req.body)
    if (!updateBlog) {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})
  
blogsRouter.delete('/:id', 
  authorizationValidation,
  inputValidationErrors, 
async (req: RequestWithParams<getByIdParam>, res: Response) => {
  const foundBlog = await blogService.deleteBlog(req.params.id);
  if (!foundBlog) {
    return res.sendStatus(sendStatus.NOT_FOUND_404)
  }
  res.sendStatus(sendStatus.NO_CONTENT_204)
})