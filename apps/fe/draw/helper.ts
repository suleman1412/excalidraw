import axios from "axios";
import { Shape } from "./index";
import { Dispatch, SetStateAction } from "react";

export const getExistingShapes = async (roomId: string, setExistingShapes: Dispatch<SetStateAction<string>>) => {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            throw new Error('No authentication token found');
        }
        const res = await axios.get(`http://localhost:8081/api/chat/${roomId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const messages = res.data.chats

        const shapes: Shape[] = messages.map((x: { message: string; }) => {
            setExistingShapes(x.message)
            return JSON.parse(x.message)
        })

        console.log('Shapes in getExistingShapes() : ', shapes)
        return shapes
    } catch (er) {
        console.error("Error getting shapes: ", er)
    }

}

export const postExistingShapes = async (newMessage: string, roomId: string, senderId: string) => {
    try {
        const token = localStorage.getItem('token')
        await axios.post('http://localhost:8081/api/chat/', {
            message: newMessage,
            roomId: roomId,
            senderId: senderId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
    } catch (error) {
        console.error('Error saving shape:', error);
    }
}



export function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!existingShapes) return;

    try {
        // Parse the shapes, ensuring it's always an array
        const parsedShapes: Shape[] = existingShapes
        console.log('IN CLEAR CANVAS \n', parsedShapes)
        parsedShapes.forEach(shape => {
            if (shape.type === 'rect') {
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
        });
    } catch (error) {
        console.error('Error parsing existing shapes:', error);
    }
}