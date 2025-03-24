import axios from "axios";
import { RefObject, useRef } from "react";
import { prismaClient } from '@repo/db/client'

type Shape = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
} | {
  type: "circle";
  centerX: number;
  centerY: number;
  radius: number;
}


export default async function initDraw(canvas: HTMLCanvasElement, isDrawingRef: RefObject<boolean>, roomId: string, senderId: string) {
  const ctx = canvas.getContext("2d")
  let existingShapes: Shape[] = await getExisitngShapes(roomId)

  if (!ctx) return;
  ctx.strokeStyle = "white"
  ctx.fillStyle = "gray"
  ctx.lineWidth = 1;
  let startX = 0;
  let startY = 0;

  clearCanvas(existingShapes, canvas, ctx)
  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    isDrawingRef.current = true
    startX = e.clientX - canvas.offsetLeft
    startY = e.clientY - canvas.offsetTop
  })
  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    if (isDrawingRef.current === true) {
      const width = e.clientX - canvas.offsetLeft - startX
      const height = e.clientY - canvas.offsetTop - startY

      clearCanvas(existingShapes, canvas, ctx)
      ctx.strokeRect(startX, startY, width, height)
    }
  })
  canvas.addEventListener('mouseup', async (e: MouseEvent) => {
    const width = e.clientX - canvas.offsetLeft - startX
    const height = e.clientY - canvas.offsetTop - startY
    isDrawingRef.current = false
    const newMessage: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height
    }
    existingShapes.push(newMessage)
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8081/api/chat/', {
        message: JSON.stringify(newMessage),
        roomId: roomId,
        senderId: senderId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error saving shape:', error);
    }

    console.log(existingShapes)
  })
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if(!existingShapes) return;
  console.log('existing shapes in clear canvas', existingShapes)
  existingShapes.map(shape => {
    if (shape.type === 'rect') {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
    }
  })
}


const getExisitngShapes = async (roomId: string) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`http://localhost:8081/api/chat/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const messages: Shape[] = res.data.chats

  const shapes = messages.map(x => {
    return JSON.parse(x.message)
  })
  console.log('Shapes in getExistingShapes() : ', shapes)  
  return shapes
}
