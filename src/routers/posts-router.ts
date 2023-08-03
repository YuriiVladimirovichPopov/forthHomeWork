import {Request, Response, Router } from "express";
import {postsRepository} from "../repositories/posts-repository";
import {sendStatus} from "./send-status";
import { authorizationValidation, 
          inputValidationErrors} from "../middlewares/input-validation-middleware";
import { createPostValidation, updatePostValidation } from '../middlewares/validations/posts.validation';
import { RequestWithBody, RequestWithParams } from '../types';
import { PostsInputModel } from "../models/posts/postsInputModel";
import { getByIdParam } from "../models/getById";
import { PostsViewModel } from '../models/posts/postsViewModel';

export const postsRouter = Router({})

postsRouter.get('/', async (_req: Request, res: Response) => {
  const allPosts = await postsRepository.findAllPosts()
    res.status(sendStatus.OK_200).send(allPosts);
  })

postsRouter.get('/:id', async (req: RequestWithParams<getByIdParam>, res: Response) => {
  const foundPost = await postsRepository.findPostById(req.params.id)    
    if (!foundPost) {
      res.sendStatus(sendStatus.NOT_FOUND_404)
    } else {
       res.status(sendStatus.OK_200).send(foundPost)
  }
  })
  
postsRouter.post('/', 
  authorizationValidation,
  createPostValidation,
async (req: RequestWithBody<PostsInputModel>, res: Response<PostsViewModel>) => {
  
  const newPost = await postsRepository.createPost(req.body)

  if(!newPost) return res.sendStatus(sendStatus.BAD_REQUEST_400)
  
  return res.status(sendStatus.CREATED_201).send(newPost)
  

})
  
postsRouter.put('/:id', 
authorizationValidation,
updatePostValidation,
async (req: Request<getByIdParam, PostsInputModel>, res: Response<PostsViewModel>) => {
  const updatePost =  await postsRepository.updatePost(req.params.id, req.body)

    if (!updatePost) {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    } else {
    res.sendStatus(sendStatus.NO_CONTENT_204)
    }
})
  
postsRouter.delete('/:id', 
authorizationValidation,
inputValidationErrors,
async (req: RequestWithParams<getByIdParam>, res: Response) => {
const foundPost = await postsRepository.deletePost(req.params.id)
if (!foundPost) {
  return res.sendStatus(sendStatus.NOT_FOUND_404);
  }
res.sendStatus(sendStatus.NO_CONTENT_204)
})