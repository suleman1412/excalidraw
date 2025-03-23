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
            where: { roomId: room?.id }
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
