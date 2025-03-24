import { RefObject } from "react";

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
export default function initDraw(canvas: HTMLCanvasElement, isDrawingRef: RefObject<boolean>) {
  const ctx = canvas.getContext("2d")
  let existingShapes: Shape[] = []

  if (!ctx) return;
  ctx.strokeStyle = "white"
  ctx.fillStyle = "gray"
  ctx.lineWidth = 1;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    isDrawingRef.current = true
    startX = e.clientX
    startY = e.clientY
  })
  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    if (isDrawingRef.current === true) {
      const width = e.clientX - startX
      const height = e.clientY - startY

      clearCanvas(existingShapes, canvas, ctx)
      ctx.strokeRect(startX, startY, width, height)
    }
  })
  canvas.addEventListener('mouseup', (e: MouseEvent) => {
    const width = e.clientX - startX - e.offsetX
    const height = e.clientY - startY - e.offsetY
    isDrawingRef.current = false
    existingShapes.push({
      type: "rect",
      x: startX,
      y: startY,
      width,
      height
    })
    console.log(existingShapes)
  })
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  existingShapes.map(shape => {
    if(shape.type === 'rect'){
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
    }
  })
}