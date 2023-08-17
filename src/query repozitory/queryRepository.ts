import { postsCollection } from '../db/db';
import { PostsMongoDbType } from '../types';
import { PaginatedType } from "../routers/helpers/pagination";
import { blogsRepository } from '../repositories/blogs-repository';
import { ObjectId, WithId } from 'mongodb';
import { PaginatedPost } from '../models/posts/paginatedQueryPost';
import { PostsViewModel } from "../models/posts/postsViewModel";
import { randomUUID } from 'crypto';


export const queryRepository = {

    _postMapper(post: PostsMongoDbType): PostsViewModel {
        return {
            id: post._id.toString(),
            title: post.title, 
            shortDescription: post.shortDescription, 
            content: post.content, 
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
        },

    
    //3         READY
    async findAllPostsByBlogId(blogId: string, pagination: PaginatedType): Promise<PaginatedPost<PostsMongoDbType>> {    //change to PostsMongoDbType(been PostViewModel)
        const result: WithId<WithId<PostsMongoDbType>>[] = await postsCollection.find({blogId}, {projection: {_id: 0}})
            .sort({[pagination.sortBy] : pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .toArray()

        const totalCount: number = await postsCollection.countDocuments({blogId})
        const pageCount: number = Math.ceil(totalCount / pagination.pageSize)

        const response: PaginatedPost<PostsMongoDbType> = {
            pagesCount: pageCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
            items: result
        }
        return response
    },
    //TODO
//4           переносим в пост репозитори
    

    //8       меняем(добавляем пагинацию)  READY
    async findAllPosts(pagination: PaginatedType):
     Promise<PaginatedPost<PostsViewModel>> {
        const result : WithId<PostsMongoDbType>[] = await postsCollection.find({}, {projection: {_id: 0}})
    .sort({[pagination.sortBy]: pagination.sortDirection })
    .skip(pagination.skip)
    .limit(pagination.pageSize)
    .toArray()

        const totalCount: number = await postsCollection.countDocuments({})
        const pageCount: number = Math.ceil(totalCount / pagination.pageSize)


    const response: PaginatedPost<PostsViewModel> = {
        pagesCount: pageCount,
        page: pagination.pageNumber,
        pageSize: pagination.pageSize,
        totalCount: totalCount,
        items: result.map(r => ({
            id: r._id.toString(),
            title: r.title,
            shortDescription: r.shortDescription,
            content: r.content,
            blogId: r.blogId,
            blogName: r.blogName,
            createdAt: r.createdAt
        }))
        }
        return response
    },

    async findPostById( id: string): Promise<PostsViewModel | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const _id = new ObjectId(id)
        const findPost = await postsCollection.findOne({_id: _id})
            if (!findPost) {
        return null
            }
            return this._postMapper(findPost)
    },
}