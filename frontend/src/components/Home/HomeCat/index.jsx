import { Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
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
          FEATURED CATEGORIES
        </Typography>

        <Swiper
          slidesPerView={8}
          spaceBetween={10}
          slidesPerGroup={1}
          navigation={true}
          modules={[Navigation]}
          className='mySwiper'
          breakpoints={{
            320: {
              slidesPerView: 3,
            },
            480: {
              slidesPerView: 4,
            },
            768: {
              slidesPerView: 6,
            },
            1024: {
              slidesPerView: 8,
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
                  style={{ backgroundColor: category?.bg }}
                >
                  <img src={category?.image} alt={category?.name} />
                </div>
                <Typography className='category-name'>
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
