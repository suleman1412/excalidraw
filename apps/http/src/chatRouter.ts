import { roomIdSchema } from "@repo/common/schema";
import { prismaClient } from "@repo/db/client";
import { Request, Response, Router } from "express";

export const chatRouter: Router = Router()

chatRouter.get('/:roomId', async (req: Request, res: Response) => {
    try {
        const { success, data, error } = roomIdSchema.safeParse(req.params)
        if (!success) {
            res.status(400).json({
                message: "Not a CUID",
                error
            })
            return;
        }
        const room = await prismaClient.room.findUnique({
            where: { id: data.roomId }
        })

        if (!room) {
            res.status(400).json({
                message: "Room doesnt exist"
            })
            return;
        }

        const chats = await prismaClient.chats.findMany({
            where: { roomId: room?.id },
            take: 10,
            orderBy: {
                createdAt: 'desc'
            }
        })

        console.log(chats)

        res.status(200).json({
            roomId: room.id,
            chats
        })
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error",
            e
        })
        return;
    }
})

chatRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { message, roomId, senderId }  = req.body;
        if(!message || !roomId || !senderId){
            res.status(400);
            return
        }
        const room = await prismaClient.room.findUnique({
            where: { id: roomId }
        })

        if (!room) {
            res.status(400).json({
                message: "Room doesnt exist"
            })
            return;
        }

        const chats = await prismaClient.chats.create({
            data: { 
                senderId: senderId,
                roomId: room.id,
                message: message
            }
        })

        console.log(chats)

        res.status(200).json({
            roomId: room.id,
            chats
        })
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error",
            e
        })
        return;
    }
})
