import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import { useHomeBanners } from '../../../hooks/useHomeBanners';
import bannerLoading from '../../../assets/images/bannerLoading.jpeg';

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
        <img
          src={bannerLoading}
          alt='banner loading'
          className='banner-loading-image'
        />
      </div>
    );

  return (
    <section className='homeBannerSection'>
      <div className='container-fluid mt-3'>
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
            homeBanners?.banners?.map(banner => (
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
                    <img
                      src={banner?.image?.url}
                      alt={banner?.image?.alt || 'Banner Image'}
                      className='banner-image'
                      loading='lazy'
                    />
                  </picture>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className='banner-item'>
                <img
                  src={bannerLoading}
                  alt='banner image'
                  className='banner-image'
                  loading='lazy'
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
