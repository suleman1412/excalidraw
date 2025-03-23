import { Request, Response, Router } from 'express'
import { authSchema } from '@repo/common/schema'
import bcrypt from 'bcrypt'
import { Prisma, prismaClient } from '@repo/db/client'
import jwt from 'jsonwebtoken'
import JWT_SECRET from '@repo/be-common/auth'

const authRouter: Router = Router()

authRouter.post('/signup', async (req: Request, res: Response) => {
    try {
        const { success, data, error } = authSchema.safeParse(req.body)
        if (!success) {
            res.status(400).json({ error: error.issues })
            return;
        }
        const hashedPass = await bcrypt.hash(data.password, 5)

        try {
            await prismaClient.user.create({
                data: {
                    username: data.username,
                    password: hashedPass
                }
            })

            res.status(201).json({
                message: "User signed up"
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    res.status(409).json({
                        message: "Username already exists, please use a different username"
                    })
                    return;
                }
            }
        }
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error",
            e
        })
        return
    }
})


authRouter.post('/signin', async (req: Request, res: Response) => {
    try {
        const { success, data, error } = authSchema.safeParse(req.body)
        if (!success) {
            res.status(400).json({ error: error.issues })
            return;
        }
        const User = await prismaClient.user.findUnique({
            where: {
                username: data.username
            }
        })

        if (!User) {
            res.status(401).json({
                message: "User doesnt exist, please signup"
            })
            return;
        }

        const match = await bcrypt.compare(data.password, User?.password)
        if (!match) {
            res.status(401).json({
                message: "Incorrect password"
            })
            return;
        }
        const token = jwt.sign({
            id: User.id
        }, JWT_SECRET)

        res.status(200).json({
            message: "Signin successful",
            token
        })
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error",
            e
        })
    }
})

export default authRouter;