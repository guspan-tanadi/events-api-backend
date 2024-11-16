import {z as validate} from 'zod';

export const authScehma = validate.object({
    email: validate.string().email("invalid email address"),
    password: validate.string().min(6, "password must be at least 6 characters long"),
})


export const registerSchema = validate.object({
    username: validate.string().min(1, "Username is required").max(50, "Maximum is 50 characters"), 
    fullname: validate.string().min(1, "Fullname is required").max(50, "Maximum is 50 characters"), 
    email: validate.string().email("invalid email address") , 
    password: validate.string().min(6, "password must be at least 6 characters long"),
    role: validate.enum(["ADMIN", "USER"])
})