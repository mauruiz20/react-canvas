import Konva from 'konva'
import { useRef } from 'react'
import { Layer, Rect, Stage } from 'react-konva'

import { CanvasContainer } from '../GlobalStyles'

const downloadURI = (uri: string, name: string) => {
  const link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const width = 500
const height = 500

const ExportCanvas: React.FC = () => {
  const stageRef = useRef<Konva.Stage>(null)

  const handleExport = () => {
    if (!stageRef.current) {
      return
    }

    const uri = stageRef.current.toDataURL()
    console.log(uri)
    downloadURI(uri, 'stage.png')
  }

  return (
    <CanvasContainer>
      <button onClick={handleExport}>Click here to export</button>
      <Stage width={width} height={height} ref={stageRef}>
        <Layer>
          <Rect x={0} y={0} width={80} height={80} fill='red' />
          <Rect x={width - 80} y={0} width={80} height={80} fill='red' />
          <Rect
            x={width - 80}
            y={height - 80}
            width={80}
            height={80}
            fill='red'
          />
          <Rect x={0} y={height - 80} width={80} height={80} fill='red' />
        </Layer>
      </Stage>
    </CanvasContainer>
  )
}

export default ExportCanvas
