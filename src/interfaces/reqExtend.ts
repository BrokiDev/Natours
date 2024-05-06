import {Request} from 'express'
import { IUser } from '../Model/Users'

export interface RequestExt extends Request {
    requestTime?:string
    user?:IUser
  
  }