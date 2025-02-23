import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

export default function MobileNav({ categories }) {
  return (
    <>
      <nav>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-2 navPart1'>
              <div className='catWrapper'>
                <div
                  className='sidebarNav'
                  style={{
                    border: '0px',
                    padding: '0px',
                    display: 'block',
                    height: 'auto',
                    left: '0px',
                    opacity: 1,
                    position: 'relative',
                    scrollbarWidth: '0px',
                    top: '0px',
                    visibility: 'inherit',
                  }}
                >
                  <ul
                    style={{
                      boxSizing: 'border-box',
                      margin: '0px',
                      padding: '0px',
                      marginTop: '0px',
                      overflow: 'scroll hidden',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      marginBottom: '0px',
                      scrollbarWidth: '0px',
                      width: '100%',
                    }}
                  >
                    {categories?.categories?.map((item, index) => (
                      <li
                        key={item._id}
                        style={{
                          boxSizing: 'border-box',
                          margin: '0px',
                          listStyle: 'none',
                          position: 'static',
                          padding: '0px',
                          display: 'inline-block',
                          verticalAlign: 'top',
                          width: 'max-content',
                        }}
                      >
                        <Link
                          to={`/shop?categories=${item._id}`}
                          style={{
                            boxSizing: 'border-box',
                            margin: '0px',
                            padding: '0px',
                            textDecoration: 'none',
                            backgroundColor: 'initial',
                            color: 'rgb(0, 123, 255)',
                          }}
                        >
                          <Button type='button'>
                            <img
                              className='mr-2'
                              width={20}
                              src={item?.image}
                              alt={item?.name}
                            />{' '}
                            {item?.name}
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
