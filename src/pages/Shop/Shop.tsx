import Konva from 'konva'
import { useEffect, useRef, useState } from 'react'
import { Image, Layer, Stage, Transformer } from 'react-konva'
import useImage from 'use-image'

import { KonvaEventObject } from 'konva/lib/Node'
import { Market, ShopContainer, ShopItem, ShopList } from './ShopStyled'
import { SHOP_ITEMS } from './helpers'

interface URLImageInterface {
  image: HTMLImageElement
  isSelected: boolean
  onSelect: (e: KonvaEventObject<Event>) => void
  onChange: (newAttrs: HTMLImageElement) => void
  onDelete: () => void
}

const INITIAL_WIDTH = 200

const URLImage: React.FC<URLImageInterface> = ({
  image,
  isSelected,
  onSelect,
  onChange,
  onDelete
}) => {
  const shapeRef = useRef<Konva.Image>(null)
  const trRef = useRef<Konva.Transformer>(null)
  const [img] = useImage(image.src)
  const height = img ? (img.height * INITIAL_WIDTH) / img.width : image.height

  const [deleteImg] = useImage('src/assets/delete.png')

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <Image
        image={img}
        x={image.x}
        y={image.y}
        offsetX={INITIAL_WIDTH / 2}
        offsetY={height / 2}
        width={INITIAL_WIDTH}
        height={height}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        draggable
        onMouseEnter={() => (document.body.style.cursor = 'pointer')}
        onMouseLeave={() => (document.body.style.cursor = 'default')}
        onDragStart={(e) => {
          e.target.setAttrs({
            scaleX: 1.05,
            scaleY: 1.05
          })
        }}
        onDragEnd={(e) => {
          e.target.setAttrs({
            scaleX: 1,
            scaleY: 1
          })
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y()
          })
        }}
        onTransformEnd={() => {
          const node = shapeRef.current
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
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox
            }
            return newBox
          }}
        >
          <Image
            image={deleteImg}
            width={30}
            height={30}
            x={-35}
            y={-35}
            onClick={onDelete}
            onTouchEnd={onDelete}
            onMouseEnter={() => (document.body.style.cursor = 'pointer')}
            onMouseLeave={() => (document.body.style.cursor = 'default')}
          />
        </Transformer>
      )}
    </>
  )
}

const SCENE_WIDTH = 800
const SCENE_HEIGHT = 600

const Shop: React.FC = () => {
  const [dragUrl, setDragUrl] = useState('')
  const stageContainerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [selectedId, selectShape] = useState<string | null>(null)

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      selectShape(null)
    }
  }

  const handleDeleteImage = () => {
    setImages((prev) => prev.filter((_, i) => i.toString() !== selectedId))
    selectShape(null)
  }

  const handleResizeCanvas = () => {
    if (stageContainerRef.current && stageRef.current) {
      const container = stageContainerRef.current
      const stage = stageRef.current

      const containerWidth = container.offsetWidth
      const scale = containerWidth / SCENE_WIDTH

      stage.width(SCENE_WIDTH * scale)
      stage.height(SCENE_HEIGHT * scale)
      stage.scale({ x: scale, y: scale })
    }
  }

  useEffect(() => {
    handleResizeCanvas()
    window.addEventListener('resize', handleResizeCanvas)

    return () => window.removeEventListener('resize', handleResizeCanvas)
  }, [])

  return (
    <ShopContainer>
      <h1>Shop</h1>
      <Market
        onDrop={(e) => {
          e.preventDefault()

          if (stageRef.current && dragUrl) {
            stageRef.current.setPointersPositions(e)

            const newImage = {
              ...stageRef.current.getPointerPosition(),
              src: dragUrl
            }

            setImages((prev) => [...prev, newImage as HTMLImageElement])
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        ref={stageContainerRef}
      >
        <Stage
          width={SCENE_WIDTH}
          height={SCENE_HEIGHT}
          ref={stageRef}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            {images.map((image, i) => {
              return (
                <URLImage
                  key={i}
                  image={image}
                  isSelected={i.toString() === selectedId}
                  onSelect={(e: KonvaEventObject<Event>) => {
                    e.target.moveToTop()
                    selectShape(i.toString())
                  }}
                  onChange={(newAttrs) => {
                    const imgs = images.slice()
                    imgs[i] = newAttrs
                    setImages(imgs)
                  }}
                  onDelete={handleDeleteImage}
                />
              )
            })}
          </Layer>
        </Stage>
      </Market>
      <ShopList>
        {SHOP_ITEMS.map((image) => (
          <ShopItem
            key={image.src}
            src={image.src}
            alt={image.alt}
            draggable
            onDragStart={(e) => {
              setDragUrl(image.src)
              stageRef.current?.setPointersPositions(e)
            }}
          />
        ))}
      </ShopList>
    </ShopContainer>
  )
}

export default Shop
