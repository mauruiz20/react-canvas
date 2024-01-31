import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { useEffect, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'

import CanvasImage from '../../components/CanvasImage/CanvasImage'
import { Market, ShopContainer, ShopItem, ShopList } from './ShopStyled'
import { ImageInterface, SHOP_ITEMS } from './helpers'

const SCENE_WIDTH = 800
const SCENE_HEIGHT = 600

const Shop: React.FC = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [draggingImageURL, setDraggingImageURL] = useState('')
  const stageContainerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleCheckDeselect = (
    e: KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      setSelectedImage(null)
    }
  }

  const handleDeleteImage = () => {
    setImages((prev) => prev.filter((el) => el.id !== selectedImage))
    setSelectedImage(null)
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

  const handleDrop = (evt: React.DragEvent) => {
    evt.preventDefault()
    const stage = stageRef.current

    if (stage && draggingImageURL) {
      stage.setPointersPositions(evt)

      const newImage = {
        ...stage.getPointerPosition(),
        id: Date.now().toString(),
        src: draggingImageURL
      }

      setImages((prev) => [...prev, newImage as HTMLImageElement])
    }
  }

  const handleDragOver = (evt: React.DragEvent) => evt.preventDefault()

  const handleSelectImage = (id: string) => () => setSelectedImage(id)

  const handleChangeImage = (newAttrs: HTMLImageElement, index: number) => {
    const imgs = images.slice()
    imgs[index] = newAttrs
    setImages(imgs)
  }

  const handleDragImage = (evt: React.DragEvent, image: ImageInterface) => {
    setDraggingImageURL(image.src)
    stageRef.current?.setPointersPositions(evt)
  }

  return (
    <ShopContainer>
      <h1>Shop</h1>
      <Market
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        ref={stageContainerRef}
      >
        <Stage
          width={SCENE_WIDTH}
          height={SCENE_HEIGHT}
          ref={stageRef}
          onMouseDown={handleCheckDeselect}
          onTouchStart={handleCheckDeselect}
        >
          <Layer>
            {images.map((image, i) => {
              return (
                <CanvasImage
                  key={image.id}
                  image={image}
                  isSelected={image.id === selectedImage}
                  onSelect={handleSelectImage(image.id)}
                  onChange={(evt) => handleChangeImage(evt, i)}
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
            onDragStart={(evt) => handleDragImage(evt, image)}
          />
        ))}
      </ShopList>
    </ShopContainer>
  )
}

export default Shop
