import {Request, Response, Router } from "express";
import { blogService} from "../domain/blog-service"
import { sendStatus } from "./send-status";
import { authorizationValidation,
          inputValidationErrors } from "../middlewares/input-validation-middleware";
import { createBlogValidation, updateBlogValidation } from "../middlewares/validations/blogs.validation";
import { createPostValidation, createPostValidationForBlogRouter } from "../middlewares/validations/posts.validation";
import { RequestWithParams, RequestWithBody, PostsMongoDbType } from '../types';
import { BlogInputModel } from "../models/blogs/blogsInputModel";
import { getByIdParam } from "../models/getById";
import { BlogViewModel } from '../models/blogs/blogsViewModel';
import { queryRepository } from "../query repozitory/queryRepository";
import { getPaginationFromQuery } from './helpers/pagination';
import { getSearchNameTermFromQuery } from "../middlewares/validations/searchNameTerm";
import { PaginatedBlog } from '../models/blogs/paginatedQueryBlog';
import { PaginatedPost } from '../models/posts/paginatedQueryPost';
import { blogsRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";
import { PostsInputModel } from '../models/posts/postsInputModel';
import { postsService } from "../domain/post-service";
import { PostsViewModel } from "../models/posts/postsViewModel";


export const blogsRouter = Router({})
//1 get/blogs         меняем(добавляем пагинацию)    доделать
blogsRouter.get('/', async (req: Request, res: Response) => {
    const pagination = getPaginationFromQuery(req.query)
    const name = getSearchNameTermFromQuery(req.query.searchNameTerm as string)
    const allBlogs: PaginatedBlog<BlogViewModel[]> = await blogService.findAllBlogs({...pagination, ...name})
    
    return res.status(sendStatus.OK_200).send(allBlogs);
  })
// 2 post/blogs          не меняем
blogsRouter.post('/',
  authorizationValidation,
  ...createBlogValidation,
  async (req: RequestWithBody<BlogViewModel>, res: Response<BlogViewModel>) => {
  
  const newBlog = await blogService.createBlog(req.body) 
  
  return res.status(sendStatus.CREATED_201).send(newBlog)
})
  
// 3 blogs/:blogId/posts         меняем(добавляем пагинацию)   доделать    SO-SO READY
blogsRouter.get('/:blogId/posts',  

async (req: Request<{blogId: string}, {}, {}, {}>, res: Response) => { 

  const blogWithPosts = await blogService.findBlogById(req.params.blogId)
  if (!blogWithPosts) {
    res.sendStatus(sendStatus.NOT_FOUND_404)
}
const pagination = getPaginationFromQuery(req.query)
  const foundBlogWithAllPosts: PaginatedPost<PostsViewModel> = 
  
  await queryRepository.findAllPostsByBlogId(req.params.blogId, pagination) 
     
  return res.status(sendStatus.OK_200).send(foundBlogWithAllPosts)
})

// 4 post blogs/:blogId/posts           меняем(добавляем пагинацию)   доделать    READY
blogsRouter.post('/:blogId/posts', 
authorizationValidation,
createPostValidationForBlogRouter,
 
async (req: Request, res: Response) => {
  
  const blogId = req.params.blogId;
  
  const {title, shortDescription, content} = req.body;
  //todo create by service
  const newPostForBlogById: PostsInputModel | null = await postsService.createPost(
      {title, shortDescription, content, blogId})

    if(newPostForBlogById) {
      return res.status(sendStatus.CREATED_201).send(newPostForBlogById);
    }
      return res.sendStatus(sendStatus.NOT_FOUND_404)
   })

// 5 get/blogs/:id       не меняем
blogsRouter.get('/:id', async (req: RequestWithParams<getByIdParam>, res: Response<BlogViewModel>) => {
    const foundBlog = await blogService.findBlogById(req.params.id);
    if (!foundBlog) return res.sendStatus(sendStatus.NOT_FOUND_404);

      return res.status(sendStatus.OK_200).send(foundBlog);
   
      
    
  })

// 6 put/blogs/:id        не меняем
blogsRouter.put('/:id',
  authorizationValidation,
  ...updateBlogValidation,
async (req: Request<getByIdParam, BlogInputModel>, res: Response<BlogViewModel>) => {
  
  const updateBlog = await blogService.updateBlog(req.params.id, req.body)
    if (!updateBlog) {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
      return res.sendStatus(sendStatus.NO_CONTENT_204)
})

// 7 delete/blogs/:id       не меняем
blogsRouter.delete('/:id', 
  authorizationValidation,
  inputValidationErrors, 
async (req: RequestWithParams<getByIdParam>, res: Response) => {
  const foundBlog = await blogService.deleteBlog(req.params.id);
  if (!foundBlog) {
    return res.sendStatus(sendStatus.NOT_FOUND_404)
  }
  return res.sendStatus(sendStatus.NO_CONTENT_204)
})

//function RouterPath(arg0: {}) {
//  throw new Error("Function not implemented.");
//}
//