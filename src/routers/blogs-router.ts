import {Request, Response, Router } from "express";
import { blogsRepository, } from '../repositories/blogs-repository';
import { sendStatus } from "./send-status";
import { authorizationValidation,
          inputValidationErrors } from "../middlewares/input-validation-middleware";
import { CreateBlogValidation, UpdateBlogValidation } from "../middlewares/validations/blogs.validation";
import { RequestWithParams, RequestWithBody } from '../types';
import { BlogInputModel } from "../models/blogs/blogsInputModel";
import { getByIdParam } from "../models/getById";
import { BlogViewModel } from '../models/blogs/blogsViewModel';
import { body } from 'express-validator';

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const allBlogs = await blogsRepository.findAllBlogs()
    
    res.status(sendStatus.OK_200).send(allBlogs);
  })
  
  blogsRouter.get('/:id', async (req: RequestWithParams<getByIdParam>, res: Response<BlogViewModel>) => {
    const foundBlog = await blogsRepository.findBlogById(req.params.id)
    if (foundBlog) {
      res.status(sendStatus.OK_200).send(foundBlog)
    } else {
      res.sendStatus(sendStatus.NOT_FOUND_404)
    }
  })
blogsRouter.post('/',
  authorizationValidation,
  ...CreateBlogValidation,
  async (req: RequestWithBody<BlogViewModel>, res: Response<BlogViewModel>) => {
  
  const newBlog = await blogsRepository.createBlog(req.body) 
  
  res.status(sendStatus.CREATED_201).send(newBlog)
})
  
blogsRouter.put('/:id',
  authorizationValidation,
  ...UpdateBlogValidation,
async (req: Request<getByIdParam, BlogInputModel>, res: Response<BlogViewModel>) => {
  
  const updateBlog = await blogsRepository.updateBlog(req.params.id, req.body)
    if (!updateBlog) {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    return res.sendStatus(sendStatus.NO_CONTENT_204)
})
  
blogsRouter.delete('/:id', 
  authorizationValidation,
  inputValidationErrors, 
async (req: RequestWithParams<getByIdParam>, res: Response) => {
  const foundBlog = await blogsRepository.deleteBlog(req.params.id);
  if (!foundBlog) {
    return res.sendStatus(sendStatus.NOT_FOUND_404)
  }
  res.sendStatus(sendStatus.NO_CONTENT_204)
})