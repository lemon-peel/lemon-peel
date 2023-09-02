import { withInstall, withNoopInstall } from '@lemon-peel/utils';
import Carousel from './src/Carousel.vue';
import CarouselItem from './src/CarouselItem.vue';

export const LpCarousel = withInstall(Carousel, {
  CarouselItem,
});

export default LpCarousel;

export const LpCarouselItem = withNoopInstall(CarouselItem);

export * from './src/carousel';
export * from './src/carouselItem';

export type CarouselInst = InstanceType<typeof Carousel>;
export type CarouselItemInst = InstanceType<typeof CarouselItem>;
