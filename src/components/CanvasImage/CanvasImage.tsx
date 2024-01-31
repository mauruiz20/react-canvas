import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { Box } from 'konva/lib/shapes/Transformer'
import { useEffect, useRef } from 'react'
import { Image, Transformer } from 'react-konva'
import useImage from 'use-image'

import deleteImage from '/src/assets/delete.png'

interface CanvasImageInterface {
  image: HTMLImageElement
  isSelected: boolean
  onSelect: (evt: KonvaEventObject<Event>) => void
  onChange: (newAttrs: HTMLImageElement) => void
  onDelete: () => void
}

const INITIAL_WIDTH = 200
const INITIAL_HEIGHT = 100

const handleMouseEnter = () => (document.body.style.cursor = 'pointer')
const handleMouseLeave = () => (document.body.style.cursor = 'default')

const CanvasImage: React.FC<CanvasImageInterface> = ({
  image,
  isSelected,
  onSelect,
  onChange,
  onDelete
}) => {
  const imageRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [img] = useImage(image.src)
  const [deleteImg] = useImage(deleteImage)

  const calculatedHeight = img
    ? (img.height * INITIAL_WIDTH) / img.width
    : INITIAL_HEIGHT

  useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      imageRef.current.moveToTop()
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer()?.batchDraw()
      transformerRef.current.moveToTop()
    }
  }, [isSelected])

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    e.target.moveToTop()
    transformerRef.current?.moveToTop()

    e.target.setAttrs({
      scaleX: e.target.scaleX() + 0.05,
      scaleY: e.target.scaleY() + 0.05,
      shadowBlur: 10,
      ShadowOpacity: 0.4
    })
  }

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    e.target.to({
      duration: 0.1,
      scaleX: e.target.scaleX() - 0.05,
      scaleY: e.target.scaleY() - 0.05,
      shadowBlur: 0,
      ShadowOpacity: 0.2
    })

    onChange({
      ...image,
      x: e.target.x(),
      y: e.target.y()
    })
  }

  const handleTransform = () => {
    const node = imageRef.current

    if (node) {
      const scaleX = node.scaleX()
      const scaleY = node.scaleY()

      onChange({
        ...image,
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(node.height() * scaleY)
      })
    }
  }

  const handleBoundBoxTransformer = (oldBox: Box, newBox: Box) => {
    if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
      return oldBox
    }

    return newBox
  }

  return (
    <>
      <Image
        image={img}
        x={image.x}
        y={image.y}
        offsetX={INITIAL_WIDTH / 2}
        offsetY={calculatedHeight / 2}
        width={INITIAL_WIDTH}
        height={calculatedHeight}
        ref={imageRef}
        onClick={onSelect}
        onTap={onSelect}
        draggable
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransform}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          flipEnabled={false}
          boundBoxFunc={handleBoundBoxTransformer}
        >
          <Image
            image={deleteImg}
            width={30}
            height={30}
            x={-35}
            y={-35}
            onClick={onDelete}
            onTouchEnd={onDelete}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </Transformer>
      )}
    </>
  )
}

export default CanvasImage
