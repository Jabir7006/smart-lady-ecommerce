import { Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { useCategories } from '../../../hooks/useCategories';

const HomeCat = () => {
  const { data: categories } = useCategories({
    sort: '-createdAt',
    order: 'desc',
  });

  return (
    <section className='featured-categories'>
      <Container>
        <Typography variant='h2' component='h2'>
          Shop By Category
        </Typography>

        <Swiper
          slidesPerView={8}
          spaceBetween={12}
          freeMode={true}
          navigation={true}
          modules={[Navigation, Autoplay, FreeMode]}
          className='mySwiper'
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 4,
              spaceBetween: 8,
              slidesPerGroup: 2,
            },
            480: {
              slidesPerView: 4.5,
              spaceBetween: 10,
              slidesPerGroup: 2,
            },
            768: {
              slidesPerView: 6,
              spaceBetween: 12,
              slidesPerGroup: 3,
            },
            1024: {
              slidesPerView: 8,
              spaceBetween: 15,
              slidesPerGroup: 4,
            },
          }}
        >
          {categories?.categories?.map(category => (
            <SwiperSlide key={category._id}>
              <Link
                to={`/shop?categories=${category._id}`}
                className='category-item'
              >
                <div
                  className='category-icon'
                  style={{
                    backgroundColor: category?.bg || '#f8f8f8',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <img
                    src={category?.image}
                    alt={category?.name}
                    loading='lazy'
                  />
                </div>
                <Typography
                  className='category-name'
                  noWrap
                  title={category?.name}
                >
                  {category?.name}
                </Typography>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default HomeCat;
