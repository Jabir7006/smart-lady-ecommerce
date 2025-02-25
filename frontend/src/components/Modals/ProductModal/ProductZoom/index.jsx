import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { InnerImageZoom } from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { useRef, useState } from 'react';

const ProductZoom = ({ images = [], discountPercentage }) => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const zoomSliderBig = useRef(null);
  const zoomSlider = useRef(null);

  const goto = index => {
    setSliderIndex(index);
    zoomSliderBig.current.swiper.slideTo(index);
    zoomSlider.current.swiper.slideTo(index);
  };

  return (
    <div className='productZoom'>
      <div className='productZoom productZoomBig position-relative mb-3'>
        {discountPercentage > 0 && (
          <div className='badge badge-primary'>{discountPercentage}%</div>
        )}
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          navigation={false}
          slidesPerGroup={1}
          modules={[Navigation]}
          className='zoomSliderBig'
          ref={zoomSliderBig}
        >
          {images?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className='item'>
                <InnerImageZoom
                  zoomType='hover'
                  zoomScale={1.5}
                  src={image.url}
                  width={1000}
                  height={1000}
                  fullscreenOnMobile={true}
                  moveType='pan'
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        className='zoomSlider'
        ref={zoomSlider}
        navigation={true}
        slidesPerGroup={1}
        modules={[Navigation]}
      >
        {images?.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className={`item${sliderIndex === index ? ' item_active' : ''}`}
            >
              <img
                src={image.url}
                className='w-100'
                onClick={() => goto(index)}
                alt={`Product image ${index + 1}`}
                style={{
                  cursor: 'pointer',
                  height: '100px',
                  objectFit: 'cover',
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductZoom;
