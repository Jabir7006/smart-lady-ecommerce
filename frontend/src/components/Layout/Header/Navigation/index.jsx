/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Skeleton } from '@mui/material';
import { useState } from 'react';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa6';
import { IoIosMenu } from 'react-icons/io';
import { Link } from 'react-router-dom';
import './Navigation.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const CategoryButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  justify-content: space-between;
`;

const Submenu = styled.div`
  display: none;
  position: absolute;
  background: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 5px;
  z-index: 100;
  .nav-item-with-submenu:hover & {
    display: block;
  }
`;

const navItemStyle = css`
  flex: 0 0 auto;
`;

const uppercaseButtonStyle = css`
  text-transform: uppercase !important;
`;

const Navigation = ({ categories, isLoading }) => {
  const [isopenSidebar, setIsopenSidebar] = useState(false);

  return (
    <nav className='my-2'>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-3 navPart1'>
            <div className='catWrapper'>
              <Button
                className='allCatTab align-items-center'
                onClick={() => setIsopenSidebar(!isopenSidebar)}
              >
                <span className='icon1 mr-2'>
                  <IoIosMenu />
                </span>
                <span className='text'>All Categories</span>
                <span className='icon2 ml-2'>
                  <FaAngleDown />
                </span>
              </Button>

              <div className={`sidebarNav ${isopenSidebar ? 'open' : ''}`}>
                <ul>
                  {categories?.categories?.map(item => (
                    <li className='nav-item-with-submenu' key={item._id}>
                      <Link to={`/shop?categories=${item._id}`}>
                        <CategoryButton>
                          <div>
                            <LazyLoadImage
                              src={item?.image}
                              alt='category'
                              width={25}
                              height={25}
                            />
                            {item.name}
                          </div>
                          {item.subcategories && item.subcategories.length > 0 && (
                            <FaAngleRight />
                          )}
                        </CategoryButton>
                      </Link>

                      {item.subcategories && item.subcategories.length > 0 && (
                        <Submenu className='submenu'>
                          {item.subcategories.map(subItem => (
                            <Link
                              key={subItem._id}
                              to={`/shop?categories=${item._id}&subcategory=${subItem._id}`}
                            >
                              <Button>{subItem.name}</Button>
                            </Link>
                          ))}
                        </Submenu>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='col-sm-9 navPart2 d-flex align-items-center'>
            <ul className='list list-inline ml-auto'>
              <li className='list-inline-item' css={navItemStyle}>
                <Link to='/' className='d-flex align-items-center'>
                  <Button css={uppercaseButtonStyle}>
                    <LazyLoadImage
                      src='https://res.cloudinary.com/dshdu9ptb/image/upload/f_auto,q_auto/uv2lhcerznmov2pvuvwg'
                      alt='logo'
                      width={22}
                      height={22}
                      className='mr-3'
                    />
                    Home
                  </Button>
                </Link>
              </li>
              <li className='list-inline-item' css={navItemStyle}>
                <Link to='/shop' className='d-flex align-items-center'>
                  <Button css={uppercaseButtonStyle}>
                    <LazyLoadImage
                      src='https://res.cloudinary.com/dshdu9ptb/image/upload/f_auto,q_auto/hwvombsazvlunklawrg7'
                      alt='logo'
                      width={22}
                      height={22}
                      className='mr-3'
                    />
                    Shop
                  </Button>
                </Link>
              </li>
              {isLoading ? (
                <ul className='list list-inline ml-auto'>
                  {Array(6) // Adjust the number to match expected categories
                    .fill(0)
                    .map((_, index) => (
                      <li key={index} className="nav-item-with-submenu">
                        <CategoryButton>
                          <Skeleton variant="circular" width={25} height={25} />
                          <Skeleton variant="text" width={100} height={40} />
                          <Skeleton variant="rectangular" width={10} height={10} />
                        </CategoryButton>
                      </li>
                    ))}
                </ul>
              ) : (
                categories?.categories?.map(item => (
                  <li className='list-inline-item nav-item-with-submenu' key={item._id} css={navItemStyle}>
                    <Link to={`/shop?categories=${item._id}`} className='d-flex align-items-center'>
                      <LazyLoadImage
                        src={item?.image}
                        alt='category'
                        width={25}
                        height={25}
                        effect='opacity'
                      />
                      <Button css={uppercaseButtonStyle}>
                        {item?.name}
                        {item.subcategories && item.subcategories.length > 0 && (
                          <FaAngleDown className='ml-1' />
                        )}
                      </Button>
                    </Link>
                    {item.subcategories && item.subcategories.length > 0 && (
                      <Submenu className='submenu top-submenu'>
                        {item.subcategories.map(subItem => (
                          <Link
                            key={subItem._id}
                            to={`/shop?categories=${item._id}&subcategory=${subItem._id}`}
                          >
                            <Button>{subItem.name}</Button>
                          </Link>
                        ))}
                      </Submenu>
                    )}
                  </li>
                )))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
