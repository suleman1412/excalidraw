import CanvasComponent from '@/components/CanvasComponent';

export default async function CanvasPage({ params} : {
    params: {
        roomId: string
    }
}) {
    const roomId = (await params).roomId;
    console.log(roomId)
    return (
        <CanvasComponent roomId={roomId}/>
    )
}
