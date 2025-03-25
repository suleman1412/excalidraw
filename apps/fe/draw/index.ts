import { Dispatch, RefObject, SetStateAction, useRef } from "react";
import { clearCanvas, getExistingShapes, postExistingShapes } from "./helper";

export type Shape = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}


export default async function initDraw(
  canvas: HTMLCanvasElement,
  isDrawingRef: RefObject<boolean>,
  roomId: string,
  senderId: string,
  existingShapes: string,
  setExistingShapes: Dispatch<SetStateAction<string>>
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return;

  ctx.strokeStyle = 'white'

  console.log('init draw')
  console.log(existingShapes)

  const shapes = await getExistingShapes(roomId, setExistingShapes)
  if (!shapes) return;

  clearCanvas(shapes, canvas, ctx)

  let startX = 0
  let startY = 0

  const handleMouseDown = (e: MouseEvent) => {
    isDrawingRef.current = true
    startX = e.clientX
    startY = e.clientY
  }
  
  const handleMouseUp = (e: MouseEvent) => {
    isDrawingRef.current = false
    const width = e.clientX - startX
    const height = e.clientY - startY
    const newShape: Shape = {
      type: 'rect',
      x: startX,
      y: startY,
      width,
      height
    }

    const updatedShapes = [...shapes, newShape];
    const updatedShapesString = JSON.stringify(updatedShapes);
    setExistingShapes(updatedShapesString);

    postExistingShapes(JSON.stringify(newShape), roomId, senderId);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearCanvas(updatedShapes, canvas, ctx)
  }
  
  const handleMouseMove = (e: MouseEvent) => {
    if(isDrawingRef.current === false) return;
    const width = e.clientX - startX
    const height = e.clientY - startY
  
    ctx.clearRect(0,0,canvas.width, canvas.height)
    clearCanvas(shapes, canvas, ctx)
    ctx.strokeRect(startX, startY, width, height)
  }
  


  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseup', handleMouseUp)
  return () => {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
  }
}

