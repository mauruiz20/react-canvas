import car from '../../assets/car.png'
import food from '../../assets/food.png'
import school from '../../assets/school.png'

interface ImageInterface {
  src: string
  alt: string
}

export const SHOP_ITEMS: ImageInterface[] = [
  {
    src: car,
    alt: 'Car'
  },
  {
    src: food,
    alt: 'Food'
  },
  {
    src: school,
    alt: 'School'
  }
]
