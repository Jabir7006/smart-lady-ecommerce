import React from 'react';

import { Link } from 'react-router-dom';
import logo from '../../../../assets/images/logo.png';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { ArrowDropDown, Home, ShoppingBag, Person } from '@mui/icons-material';

export default function MobileSidebar({ categories }) {
  return (
    <div className='mobile-sidebar'>
      <div className='mobile-sidebar-header'>
        <Link className='logo' to='/'>
          <img
            alt='logo'
            src={logo}
            className='mobile-sidebar-logo'
            style={{ maxHeight: '30px' }}
          />
        </Link>
      </div>

      <Divider />

      <List className='mobile-sidebar-nav' dense>
        <ListItem component={Link} to='/' className='mobile-sidebar-item' dense>
          <ListItemIcon>
            <Home fontSize='small' style={{ fontSize: '16px' }} />
          </ListItemIcon>
          <ListItemText
            primary='Home'
            primaryTypographyProps={{ fontSize: '13px' }}
          />
        </ListItem>

        <ListItem
          component={Link}
          to='/shop'
          className='mobile-sidebar-item'
          dense
        >
          <ListItemIcon>
            <ShoppingBag fontSize='small' style={{ fontSize: '16px' }} />
          </ListItemIcon>
          <ListItemText
            primary='Shop'
            primaryTypographyProps={{ fontSize: '13px' }}
          />
        </ListItem>

        <Divider />

        <ListItem className='mobile-sidebar-category-header' dense>
          <ListItemText
            primary='Categories'
            primaryTypographyProps={{ fontSize: '13px', fontWeight: 600 }}
          />
        </ListItem>

        {categories?.categories?.map((item, index) => (
          <ListItem
            key={item._id}
            component={Link}
            to={`/shop?categories=${item._id}`}
            className='mobile-sidebar-category'
            dense
          >
            <ListItemIcon>
              <img
                className='category-icon'
                src={item?.image}
                alt=''
                style={{ width: '18px', height: '18px' }}
              />
            </ListItemIcon>
            <ListItemText
              primary={item?.name}
              primaryTypographyProps={{ fontSize: '12px' }}
            />
            {item.subcategories && item.subcategories.length > 0 && (
              <ArrowDropDown
                className='category-arrow'
                fontSize='small'
                style={{ fontSize: '16px' }}
              />
            )}
          </ListItem>
        ))}
      </List>

      <Divider />

      <div className='mobile-sidebar-footer'>
        <Link to='/login' className='mobile-sidebar-login'>
          <Button
            className='btn-blue w-100'
            variant='contained'
            startIcon={<Person fontSize='small' style={{ fontSize: '16px' }} />}
            size='small'
          >
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
