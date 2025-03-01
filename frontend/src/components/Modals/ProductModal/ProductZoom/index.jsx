/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { InnerImageZoom } from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { useRef, useState } from 'react';

const productZoomStyles = {
  productZoom: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  productZoomBig: css`
    width: 100%;
  `,
  item: css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
      height: auto;
    }
  `,
  discountBadge: css`
    position: absolute;
    top: 10px;
    left: 10px;
    background: red;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: bold;
  `,
  thumbnailImage: css`
    cursor: pointer;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
  `,
  itemActive: css`
    border: 2px solid blue;
  `,
};

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
    <div className='productZoom' css={productZoomStyles.productZoom}>
      <div className='productZoomBig' css={productZoomStyles.productZoomBig}>
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
              <div className='item' css={productZoomStyles.item}>
                {index === 0 && discountPercentage > 0 && (
                  <span className='badge badge-danger' css={productZoomStyles.discountBadge}>
                    {discountPercentage}% OFF
                  </span>
                )}
                <InnerImageZoom
                  zoomType='hover'
                  zoomScale={1.5}
                  src={image.url}
                  width={800}
                  height={800}
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
            <div className={`item${sliderIndex === index ? ' item_active' : ''}`} css={sliderIndex === index ? productZoomStyles.itemActive : null}>
              <img
                src={image.url}
                className='w-100'
                onClick={() => goto(index)}
                alt={`Product image ${index + 1}`}
                css={productZoomStyles.thumbnailImage}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductZoom;
