import { Image, Layer, Stage } from 'react-konva'
import useImage from 'use-image'

import { CanvasContainer } from '../GlobalStyles'

const YodaImage = () => {
  const [image] = useImage('https://konvajs.org/assets/yoda.jpg')
  return <Image image={image} />
}

const LionImage = () => {
  const [image] = useImage('https://konvajs.org/assets/lion.png')
  return <Image image={image} x={250} />
}

const ImageCanvas = () => {
  return (
    <CanvasContainer>
      <Stage width={500} height={500}>
        <Layer>
          <YodaImage />
          <LionImage />
        </Layer>
      </Stage>
    </CanvasContainer>
  )
}

export default ImageCanvas
