import {Request, Response, Router } from "express";
import { blogService} from "../domain/blog-service"
import { sendStatus } from "./send-status";
import { authorizationValidation,
          inputValidationErrors } from "../middlewares/input-validation-middleware";
import { createBlogValidation, updateBlogValidation } from "../middlewares/validations/blogs.validation";
import { createPostValidation } from "../middlewares/validations/posts.validation";
import { RequestWithParams, RequestWithBody, PostsMongoDbType } from '../types';
import { BlogInputModel } from "../models/blogs/blogsInputModel";
import { getByIdParam } from "../models/getById";
import { BlogViewModel } from '../models/blogs/blogsViewModel';
import { queryRepozitory } from "../query repozitory/queryRepository";
import { getPaginationFromQuery } from './helpers/pagination';
import { getSearchNameTermFromQuery } from "../middlewares/validations/searchNameTerm";
import { PaginatedBlog } from '../models/blogs/paginatedQueryBlog';
import { PaginatedPost } from '../models/posts/paginatedQueryPost';
import { blogsRepository } from "../repositories/blogs-repository";


export const blogsRouter = Router({})
//1 get/blogs         меняем(добавляем пагинацию)    доделать
blogsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationFromQuery(req.query)
    const name = getSearchNameTermFromQuery(req.query.searchNameTerm as string)
    const allBlogs: PaginatedBlog<BlogViewModel> = await blogService.findAllBlogs({...pagination, ...name})
    
    res.status(sendStatus.OK_200).send(allBlogs);
  })
// 2 post/blogs          не меняем
blogsRouter.post('/',
  authorizationValidation,
  ...createBlogValidation,
  async (req: RequestWithBody<BlogViewModel>, res: Response<BlogViewModel>) => {
  
  const newBlog = await blogService.createBlog(req.body) 
  
  res.status(sendStatus.CREATED_201).send(newBlog)
})
  
// 3 blogs/{blogId}/posts         меняем(добавляем пагинацию)   доделать    SO-SO READY
blogsRouter.get('/blogs/{blogId}/posts', authorizationValidation, 

async (req: Request, res: Response) => { 

  const blogWithPosts = await blogService.findBlogById(req.params.blogId)
  if (!blogWithPosts) {
    res.sendStatus(sendStatus.NOT_FOUND_404)
}
const pagination = getPaginationFromQuery(req.query)
  const foundBlogWithAllPosts: PaginatedPost<PostsMongoDbType> = 
  
  await queryRepozitory.findAllPostsByBlogId(req.param.blogId, pagination) 
     
    res.status(sendStatus.OK_200).send(foundBlogWithAllPosts)

  
})
// 4 post blogs/{blogId}/posts           меняем(добавляем пагинацию)   доделать    READY
blogsRouter.post('/blogs/{blogId}/posts', 
authorizationValidation,
...createBlogValidation, 
...createPostValidation,
 
async (req: Request, res: Response) => {
  const blogWithId: BlogViewModel| null = await blogsRepository.findBlogById(req.params.blogId) 
  if(!blogWithId) {
    return res.sendStatus(404)
  }

  const newPostForBlogById = await queryRepozitory.createdPostForSpecificBlog(
    req.body.title, 
    req.body.shortDescription, 
    req.body.content, 
    req.params.blogId)

    if(newPostForBlogById) {
      res.status(sendStatus.CREATED_201).send(newPostForBlogById)
    }
   }
)

// 5 get/blogs/:id       не меняем
blogsRouter.get('/:id', async (req: RequestWithParams<getByIdParam>, res: Response<BlogViewModel>) => {
    const foundBlog = await blogService.findBlogById(req.params.id)
    if (foundBlog) {
      res.status(sendStatus.OK_200).send(foundBlog)
    } else {
      res.sendStatus(sendStatus.NOT_FOUND_404)
    }
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
    res.sendStatus(sendStatus.NO_CONTENT_204)
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
  res.sendStatus(sendStatus.NO_CONTENT_204)
})

function RouterPath(arg0: {}) {
  throw new Error("Function not implemented.");
}
