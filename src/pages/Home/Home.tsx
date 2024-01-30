import DndImageCanvas from '../../components/DndImageCanvas/DndImageCanvas'
import ExportCanvas from '../../components/ExportCanvas/ExportCanvas'
import ImageCanvas from '../../components/ImageCanvas/ImageCanvas'
import StarCanvas from '../../components/StarCanvas/StarCanvas'
import TransformCanvas from '../../components/TransformCanvas/TransformCanvas'
import { Content, HomeContainer } from './HomeStyled'

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <h1>React Konva</h1>
      <Content>
        <StarCanvas />
        <ImageCanvas />
        <TransformCanvas />
        <ExportCanvas />
        <DndImageCanvas />
      </Content>
    </HomeContainer>
  )
}

export default Home
