import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';

export default function MobileNav({ categories }) {
  if (!categories?.categories?.length) return null;

  return (
    <div className='mobile-category-nav'>
      <div className='container'>
        <Swiper
          slidesPerView='auto'
          spaceBetween={4}
          freeMode={{
            enabled: true,
            minimumVelocity: 0.02,
            momentum: true,
            momentumRatio: 0.8,
            momentumBounce: false,
          }}
          modules={[FreeMode]}
          className='mobile-category-swiper'
        >
          {categories?.categories?.map(item => (
            <SwiperSlide key={item._id} className='mobile-category-slide'>
              <Link
                to={`/shop?categories=${item._id}`}
                className='mobile-category-link'
                title={item?.name}
                aria-label={`Shop ${item?.name}`}
              >
                <div className='mobile-category-icon'>
                  <img src={item?.image} alt='' />
                </div>
                <span className='mobile-category-name'>{item?.name}</span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
