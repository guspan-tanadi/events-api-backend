import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Auth } from "../models/models";
import { PrismaClient } from "@prisma/client";
import { authScehma, registerSchema } from "../validator/auth.validator";

interface DecodedToken {
    id: number
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export class AuthService {
    private prisma: PrismaClient

    constructor(){
        this.prisma = new PrismaClient()
    }

    async register(data: { username: string; fullname: string; email: string; password: string; role: "ADMIN" | "USER"; }) {
        const validatedData = registerSchema.parse(data);
        const hashedPassword = await bcrypt.hash(data.password, 10); // Use 10 rounds
        return this.prisma.users.create({
            data: {
                username: validatedData.username,
                fullname: validatedData.fullname,
                email: validatedData.email,
                password: hashedPassword,
                role: validatedData.role,
              }
        });
    }

    async login(email: string, password: string){
        const data = {email, password}
        const validatedData = authScehma.parse(data);
        const user = await this.prisma.users.findUnique({
            where: {
                email: validatedData.email,
            }
        })

        if(!user || !(await bcrypt.compare(password, String(user.password))) || ""){
            throw new Error('Invalid Credentials')
        }

        const accessToken = jwt.sign({id: user.user_id, role: user.role}, JWT_SECRET, {
            expiresIn: '1h', //masa berlaku token 1 jam
        })

        const refreshToken = jwt.sign({id: user.user_id}, JWT_SECRET, {
            expiresIn: '7d', //masa berlaku token 7 hari
        })

        //simpan refesh token ke database
        await this.prisma.users.update({
            where: {
                email: email,
            }, 
            data: {
                refresh_token: refreshToken,
            },
        })

        return {accessToken, refreshToken, user}
    }

    async refereshToken(token: string){
        try {
            const decoded: DecodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken
            const user = await this.prisma.users.findUnique({
                where:{
                    user_id: decoded.id,
                }
            })
            if(!user){
                throw new Error('Invalid Refersh Token')
            }
            //buat token baru
            const accesstoken  = jwt.sign({id: user.user_id, role: user.role}, JWT_SECRET, {expiresIn: '1h'})

            return {accesstoken}
        } catch (error) {
            throw new Error('Invalid Refersh Token')
        }
    }
}

