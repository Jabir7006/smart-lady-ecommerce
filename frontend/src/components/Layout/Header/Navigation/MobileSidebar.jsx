import React from 'react';

import { Link } from 'react-router-dom';
import logo from '../../../../assets/images/logo.png';
import { Button } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

export default function MobileSidebar({ categories }) {
  return (
    <div style={{ padding: '15px 5px', width: '80vw' }}>
      <React.Fragment>
        <Link
          className='logo'
          to='/'
          style={{
            display: 'block',
            paddingBottom: '15px',
          }}
        >
          <img
            alt='logo'
            src={logo}
            style={{
              boxSizing: 'border-box',
              marginLeft: '8px',
              verticalAlign: 'middle',
              width: '120px',
            }}
          />
        </Link>

        {categories?.categories?.map((item, index) => (
          <li
            className='list-inline-item'
            style={{
              width: '100%',
              position: 'relative',
            }}
          >
            <Link to={`/shop?categories=${item._id}`}>
              <Button
                type='button'
                tabIndex='0'
                style={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontWeight: 600,
                  padding: '10px 20px',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                }}
              >
                <img className='mr-2' width={25} src={item?.image} />{' '}
                {item?.name}
              </Button>
            </Link>
            <span
              className='arrow false'
              style={{
                boxSizing: 'border-box',
                margin: '0px',
                padding: '0px',
                background: 'rgb(241, 241, 241)',
                borderRadius: '100%',
                transition: '0.3s ease-in-out',
                alignItems: 'center',
                display: 'flex',
                height: '35px',
                justifyContent: 'center',
                position: 'absolute',
                right: '20px',
                top: '7px',
                width: '35px',
                zIndex: 100,
              }}
            >
              <ArrowDropDown />
            </span>
            <div
              className='submenu false'
              style={{
                overflow: 'hidden',
              }}
            ></div>
          </li>
        ))}

        <div className='pt-3 pl-3 pr-3'>
          <Link to='/login'>
            <Button
              className='btn-blue w-100 btn-big'
              type='button'
              tabIndex='0'
            >
              Sign In
            </Button>
          </Link>
        </div>
      </React.Fragment>
    </div>
  );
}
