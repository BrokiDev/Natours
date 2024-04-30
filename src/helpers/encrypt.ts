import {hash,compare} from 'bcrypt'

export const encryptPassword = async (password:string,salts:number)=> {
    return await hash(password,salts)
}

export const verifyPassword = async(plainPass:string,hashedPass:string) => {
    return await compare(plainPass,hashedPass)
}