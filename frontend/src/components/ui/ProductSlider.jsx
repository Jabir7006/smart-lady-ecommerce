import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { Button } from '@mui/material';
import ProductItem from '../Products/ProductItem/ProductItem';

const ProductSlider = ({ title = '', description = '', itemView = 4, products = [] }) => {
  return (
    <>
      <div className='d-flex align-items-center res-flex-column'>
        <div className='info w-50'>
          <h3 className='mb-0 hd'>{title}</h3>
          <p className='text-muted text-sm mb-0'>{description}</p>
        </div>
        <Button className='viewAllBtn ml-auto'>
          View all
          <IoIosArrowRoundForward />
        </Button>
      </div>
      <div className='product_row w-100 mt-2' style={{ opacity: 1 }}>
        <Swiper 
          slidesPerView={itemView}
          spaceBetween={0}
          navigation={true}
          modules={[Navigation]}
          className='mySwiper'
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 15
            },
            1024: {
              slidesPerView: itemView,
              spaceBetween: 0
            }
          }}
        >
          {products?.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductItem product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default ProductSlider;
