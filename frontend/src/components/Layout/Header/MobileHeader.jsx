import React, { useState } from 'react';
import MobileNav from './Navigation/MobileNav';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Menu, ShoppingCart } from '@mui/icons-material';
import MobileSidebar from './Navigation/MobileSidebar';
import Drawer from '@mui/material/Drawer';
import logo from '../../../assets/images/logo.png';
export default function MobileHeader({ categories }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };

  const buttonStyle = {
    color: 'rgb(0, 0, 0)',
    cursor: 'pointer',
    borderRadius: '100%',
  };
  return (
    <>
      <header
        className='header'
        style={{
          padding: '5px 0px',
          width: '100%',
        }}
      >
        <div className='container'>
          <div className='row pb-1'>
            <div className='logoWrapper d-flex align-items-center col-sm-2'>
              <Button
                className='circle'
                type='button'
                tabIndex='0'
                style={buttonStyle}
                onClick={toggleDrawer('left', true)}
              >
                <Menu />
              </Button>
              <Drawer
                anchor='left'
                open={isOpen}
                onClose={() => setIsOpen(false)}
              >
                <MobileSidebar categories={categories} />
              </Drawer>
              <Link
                className='logo'
                to='/'
                style={{
                  boxSizing: 'border-box',
                  padding: '0px',
                  textDecoration: 'none',
                  backgroundColor: 'initial',
                  color: 'rgb(0, 123, 255)',
                  margin: 'auto',
                }}
              >
                <img
                  alt='Logo'
                  src={logo}
                  style={{
                    boxSizing: 'border-box',
                    padding: '0px',
                    borderStyle: 'none',
                    verticalAlign: 'middle',
                    margin: 'auto',
                    width: '120px',
                  }}
                />
              </Link>
              <div className='position-relative cartTab'>
                <Link className='ml-auto' to='/cart'>
                  <Button
                    className='circle'
                    type='button'
                    tabIndex='0'
                    style={buttonStyle}
                  >
                    <ShoppingCart />
                  </Button>
                  <span className='count d-flex align-items-center justify-content-center'>
                    0
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileNav categories={categories} />
    </>
  );
}
