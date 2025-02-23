import { Button } from '@mui/material';
import { useState } from 'react';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa6';
import { IoIosMenu } from 'react-icons/io';
import { Link } from 'react-router-dom';

import home from '../../../../assets/images/home.png';
import shop from '../../../../assets/images/shop.png';

const Navigation = ({ categories }) => {
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

              <div
                className={`sidebarNav ${isopenSidebar === true ? 'open' : ''} `}
              >
                <ul className=''>
                  <li>
                    <Link>
                      <Button>
                        Men
                        <FaAngleRight className='ml-auto' />
                      </Button>
                    </Link>

                    <div className='submenu'>
                      <Link to={'/'}>
                        <Button>Ok Ok</Button>
                      </Link>
                      <Link to={'/'}>
                        <Button>Ok Ok</Button>
                      </Link>
                      <Link to={'/'}>
                        <Button>Home</Button>
                      </Link>
                    </div>
                  </li>
                  {categories?.categories?.map(item => (
                    <li className='' key={item._id}>
                      <Link to={`/shop?categories=${item._id}`}>
                        <Button
                          // className='d-flex align-items-center'
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <img
                            src={item?.image}
                            alt='category'
                            width={25}
                            height={25}
                          />
                          {item.name}
                          {/* {item.subMenu && <FaAngleRight className='ml-auto' />} */}
                        </Button>
                      </Link>
                      {/* 
                      {item.subMenu && (
                        <div className='submenu'>
                          {item.subMenu.map(subItem => (
                            <Link key={subItem.id} to={'/'}>
                              <Button>{subItem.title}</Button>
                            </Link>
                          ))}
                        </div>
                      )} */}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='col-sm-9 navPart2 d-flex align-items-center'>
            <ul className='list list-inline ml-auto'>
              <li className='list-inline-item' style={{ flex: '0 0 auto' }}>
                <Link to='/' className='d-flex align-items-center'>
                  <Button style={{ textTransform: 'uppercase !important' }}>
                    <img
                      src={home}
                      alt='logo'
                      width={25}
                      height={25}
                      className='mr-3'
                    />
                    Home
                  </Button>
                </Link>
              </li>
              <li className='list-inline-item' style={{ flex: '0 0 auto' }}>
                <Link to='/shop' className='d-flex align-items-center'>
                  <Button style={{ textTransform: 'uppercase !important' }}>
                    <img
                      src={shop}
                      alt='logo'
                      width={25}
                      height={25}
                      className='mr-3'
                    />
                    Shop
                  </Button>
                </Link>
              </li>
              {categories?.categories?.map(item => (
                <li
                  className='list-inline-item'
                  key={item._id}
                  style={{ flex: '0 0 auto' }}
                >
                  <Link
                    to={`/shop?categories=${item._id}`}
                    className='d-flex align-items-center'
                  >
                    <img
                      src={item?.image}
                      alt='category'
                      width={25}
                      height={25}
                    />
                    <Button
                      style={{
                        textTransform: 'uppercase !important',
                        fontWeight: 'bold',
                      }}
                    >
                      {item?.name}
                      {/* {item?.subMenu && <FaAngleDown className='ml-1' />} */}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
