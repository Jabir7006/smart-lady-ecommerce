import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { useHomeBanners } from '../../../hooks/useHomeBanners';
import bannerLoading from '../../../assets/images/bannerLoading.jpeg';
const HomeBanner = () => {
  const { data: homeBanners, isLoading } = useHomeBanners();

  if (isLoading)
    return (
      <div>
        <img
          src={bannerLoading}
          alt='banner loading'
          style={{ transform: 'scale(1.5)' }}
        />
      </div>
    );

  return (
    <div className='container-fluid mt-3'>
      <div className='homeBannerSection'>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={true}
          spaceBetween={15}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnHover: false,
          }}
          loop={false}
          className='banner-slider'
        >
          {homeBanners?.banners?.length > 0 ? (
            homeBanners?.banners?.map(banner => (
              <SwiperSlide key={banner._id}>
                <div className='item'>
                  <img
                    src={banner?.image?.url}
                    alt={banner?.image?.alt}
                    className='w-100'
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <div className='item'>
              <img src={bannerLoading} alt='banner image' className='w-100' />
            </div>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeBanner;
