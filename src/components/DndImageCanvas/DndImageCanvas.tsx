import Konva from 'konva'
import { useRef, useState } from 'react'
import { Image, Layer, Stage } from 'react-konva'
import useImage from 'use-image'

import { CanvasContainer } from '../GlobalStyles'

interface URLImageInterface {
  image: HTMLImageElement
}

const URLImage: React.FC<URLImageInterface> = ({ image }) => {
  const [img] = useImage(image.src)
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      // I will use offset to set origin to the center of the image
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
    />
  )
}

const DndImageCanvas: React.FC = () => {
  const [dragUrl, setDragUrl] = useState('')
  const stageRef = useRef<Konva.Stage>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  return (
    <div>
      Try to trag and image into the stage:
      <br />
      <img
        alt='lion'
        src='https://konvajs.org/assets/lion.png'
        draggable='true'
        onDragStart={(e: React.DragEvent<HTMLImageElement>) => {
          setDragUrl(e.currentTarget.src)
        }}
      />
      <CanvasContainer
        onDrop={(e) => {
          e.preventDefault()

          if (stageRef.current && dragUrl) {
            // register event position
            stageRef.current.setPointersPositions(e)

            const newImage = {
              ...stageRef.current.getPointerPosition(),
              src: dragUrl
            }

            // add image
            setImages((prev) => [...prev, newImage as HTMLImageElement])
          }
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Stage
          width={500}
          height={500}
          style={{ border: '1px solid grey' }}
          ref={stageRef}
        >
          <Layer>
            {images.map((image) => {
              return <URLImage key={image.src} image={image} />
            })}
          </Layer>
        </Stage>
      </CanvasContainer>
    </div>
  )
}

export default DndImageCanvas
