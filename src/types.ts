import { Request } from "express"
import { ObjectId } from 'mongodb';


  export type BlogsMongoDbType = {
      _id : ObjectId,
      name: string,
      description: string,
      websiteUrl: string,
      createdAt: string,
      isMembership: boolean 
  }

  export type PostsMongoDbType = {
      _id: ObjectId,
      title: string,
      shortDescription: string,
      content: string,
      blogId: string,
      blogName: string,
      createdAt: string
  }

  


export type RequestWithParams<T> = Request<T>
export type RequestWithBody<T> = Request<{}, {}, T>
//export type RequestWithParamsAndBody<T, B> = Request<TemplateStringsArray, {}, B>