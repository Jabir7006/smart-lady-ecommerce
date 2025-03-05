import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import { useHomeBanners } from '../../../hooks/useHomeBanners';
import { LazyLoadImage } from 'react-lazy-load-image-component';


const HomeBanner = () => {
  const { data: homeBanners, isLoading } = useHomeBanners();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading)
    return (
      <div className='banner-loading-container'>
        <LazyLoadImage
          src="https://res.cloudinary.com/dshdu9ptb/image/upload/f_auto,q_auto/np3ohwpg2f5vvizw5yfm"
          alt='banner loading'
          className='banner-loading-image'
          effect="opacity"
        />
      </div>
    );

  return (
    <section className='homeBannerSection'>
      <div className='mt-3 px-2'>
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          navigation={!isMobile}
          pagination={{ clickable: true, dynamicBullets: true }}
          spaceBetween={15}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnHover: true,
          }}
          loop={true}
          className='banner-slider'
          grabCursor={true}
          effect='fade'
          fadeEffect={{ crossFade: true }}
        >
          {homeBanners?.banners?.length > 0 ? (
            homeBanners.banners.map(banner => (
              <SwiperSlide key={banner._id}>
                <div className='banner-item'>
                  <picture>
                    <source
                      media='(max-width: 768px)'
                      srcSet={banner?.image?.mobile_url || banner?.image?.url}
                    />
                    <source
                      media='(min-width: 769px)'
                      srcSet={banner?.image?.url}
                    />
                    <LazyLoadImage
                      src={banner?.image?.url}
                      alt={banner?.image?.alt || 'Banner Image'}
                      className='banner-image'
                      loading='lazy'
                      effect="opacity"
                    />
                  </picture>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className='banner-item'>
                <LazyLoadImage
                  src="https://res.cloudinary.com/dshdu9ptb/image/upload/f_auto,q_auto/np3ohwpg2f5vvizw5yfm"
                  alt='banner image'
                  className='banner-image'
                  loading='lazy'
                  effect="opacity"
                />
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeBanner;
