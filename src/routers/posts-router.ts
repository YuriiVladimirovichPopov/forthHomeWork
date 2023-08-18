import {Request, Response, Router } from "express";
import {sendStatus} from "./send-status";
import { authorizationValidation, 
          inputValidationErrors} from "../middlewares/input-validation-middleware";
import { createPostValidation, updatePostValidation } from '../middlewares/validations/posts.validation';
import { RequestWithBody, RequestWithParams } from '../types';
import { PostsInputModel } from "../models/posts/postsInputModel";
import { getByIdParam } from "../models/getById";
import { PostsViewModel } from '../models/posts/postsViewModel';
import { postsService } from "../domain/post-service";
import { queryRepository } from "../query repozitory/queryRepository";
import { getPaginationFromQuery } from './helpers/pagination';
import { PaginatedPost } from '../models/posts/paginatedQueryPost';
import { blogsRepository } from "../repositories/blogs-repository";


export const postsRouter = Router({})
//8        меняем(добавляем пагинацию)    доделать       SO-SO READY
postsRouter.get('/', async (req: Request, res: Response<PaginatedPost<PostsViewModel>>) => {
  const pagination = getPaginationFromQuery(req.query)
  const allPosts: PaginatedPost<PostsViewModel> = await queryRepository.findAllPosts(pagination)
    if (!allPosts){
      return res.status(sendStatus.NOT_FOUND_404)
    }
    res.status(sendStatus.OK_200).send(allPosts);
  })

//9         не меняем    READY
postsRouter.post('/', 
  authorizationValidation,
  createPostValidation,
async (req: RequestWithBody<PostsInputModel>, res: Response<PostsViewModel>) => {
  
  const findBlogById =  await blogsRepository.findBlogById(req.body.blogId)
  
  if (findBlogById) {
    const { title ,shortDescription, content, blogId} = req.body
  const newPost: PostsViewModel | null = await postsService.createPost({title, shortDescription, content, blogId})
  
  if(!newPost) {
    return res.sendStatus(sendStatus.BAD_REQUEST_400)
  }
    return res.status(sendStatus.CREATED_201).send(newPost)
  }
})

//10         не меняем      READY
postsRouter.get('/:id', async (req: RequestWithParams<getByIdParam>, res: Response) => {
  const foundPost = await postsService.findPostById(req.params.id)    
    if (!foundPost) {
      res.sendStatus(sendStatus.NOT_FOUND_404)
    } else {
       res.status(sendStatus.OK_200).send(foundPost)
  }
  })

 //11        не меняем       READY
postsRouter.put('/:id', 
  authorizationValidation,
  updatePostValidation,
async (req: Request<getByIdParam, PostsInputModel>, res: Response<PostsViewModel>) => {
  const updatePost =  await postsService.updatePost(req.params.id, req.body)

    if (!updatePost) {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    } else {
    res.sendStatus(sendStatus.NO_CONTENT_204)
    }
})

//12          не меняем       READY
postsRouter.delete('/:id', 
  authorizationValidation,
  inputValidationErrors,
async (req: RequestWithParams<getByIdParam>, res: Response) => {
const foundPost = await postsService.deletePost(req.params.id)
if (!foundPost) {
  return res.sendStatus(sendStatus.NOT_FOUND_404);
  }
res.sendStatus(sendStatus.NO_CONTENT_204)
})