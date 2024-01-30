import { KonvaEventObject } from 'konva/lib/Node'
import { useState } from 'react'
import { Layer, Stage, Star } from 'react-konva'

import { CanvasContainer } from '../GlobalStyles'

interface StarInterface {
  id: string
  x: number
  y: number
  rotation: number
  isDragging: boolean
}

const generateShapes = (): StarInterface[] => {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * 500,
    y: Math.random() * 500,
    rotation: Math.random() * 180,
    isDragging: false
  }))
}

const INITIAL_STATE = generateShapes()

const StarCanvas = () => {
  const [stars, setStars] = useState<StarInterface[]>(INITIAL_STATE)

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    const id = e.target.id()
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: star.id === id
        }
      })
    )
  }
  const handleDragEnd = () => {
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: false
        }
      })
    )
  }

  return (
    <CanvasContainer>
      <Stage width={500} height={500}>
        <Layer>
          {stars.map((star) => (
            <Star
              key={star.id}
              id={star.id}
              x={star.x}
              y={star.y}
              numPoints={5}
              innerRadius={20}
              outerRadius={40}
              fill='#ead707'
              opacity={0.8}
              draggable
              rotation={star.rotation}
              shadowColor='black'
              shadowBlur={10}
              shadowOpacity={0.6}
              shadowOffsetX={star.isDragging ? 10 : 5}
              shadowOffsetY={star.isDragging ? 10 : 5}
              scaleX={star.isDragging ? 1.2 : 1}
              scaleY={star.isDragging ? 1.2 : 1}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Layer>
      </Stage>
    </CanvasContainer>
  )
}

export default StarCanvas
