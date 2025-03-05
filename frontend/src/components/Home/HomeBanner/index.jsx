
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState, useCallback, memo } from 'react';
import { useHomeBanners } from '../../../hooks/useHomeBanners';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import bannerLoading from '../../../assets/images/bannerLoading.jpeg';

// Optimize image loading with preload hints
const preloadImage = (src) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

const HomeBanner = memo(() => {
  const { data: homeBanners, isLoading } = useHomeBanners();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Optimize resize listener with RAF
  useEffect(() => {
    let frameId;
    const handleResize = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setIsMobile(window.innerWidth <= 768);
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // Preload first banner image
  useEffect(() => {
    if (homeBanners?.banners?.[0]?.image?.public_id) {
      const firstBanner = homeBanners.banners[0];
      const cloudinaryBaseUrl = 'https://res.cloudinary.com/dshdu9ptb/image/upload';
      const desktopUrl = `${cloudinaryBaseUrl}/w_1920,h_600,q_auto,f_webp/${firstBanner.image.public_id}.webp`;
      preloadImage(desktopUrl);
    }
  }, [homeBanners]);

  const getOptimizedImageUrl = useCallback((publicId, width, height) => {
    return `https://res.cloudinary.com/dshdu9ptb/image/upload/w_${width},h_${height},q_auto,f_webp/${publicId}.webp`;
  }, []);

  if (isLoading) {
    return (
      <div className='banner-loading-container' role="progressbar" aria-busy="true">
        <LazyLoadImage
          src={bannerLoading}
          alt="Loading banner"
          className='banner-loading-image'
          width="100%"
          height="auto"
          loading="eager"
        />
      </div>
    );
  }

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
          lazy={{ loadPrevNext: true }}
          preloadImages={false}
        >
          {homeBanners?.banners?.map(banner => (
            <SwiperSlide key={banner._id}>
              <div className='banner-item'>
                <picture>
                  <source
                    media="(max-width: 768px)"
                    srcSet={getOptimizedImageUrl(banner.image.public_id, 768, 400)}
                    type="image/webp"
                  />
                  <source
                    media="(min-width: 769px)"
                    srcSet={getOptimizedImageUrl(banner.image.public_id, 1920, 600)}
                    type="image/webp"
                  />
                  <LazyLoadImage
                    src={getOptimizedImageUrl(banner.image.public_id, 1920, 600)}
                    alt={banner.image.alt || 'Banner'}
                    className='banner-image'
                    effect="opacity"
                    width="100%"
                    height="auto"
                    loading={banner._id === homeBanners.banners[0]._id ? 'eager' : 'lazy'}
                  />
                </picture>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
});

export default HomeBanner;
