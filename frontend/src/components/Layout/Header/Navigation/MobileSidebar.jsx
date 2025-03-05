/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { ArrowDropDown, Home, ShoppingBag, Person } from '@mui/icons-material';

// Styled Components
const SidebarHeader = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  background: #f8f9fa;
`;

const SidebarNav = styled(List)`
  padding: 0;
`;

const SidebarItem = styled(ListItem)`
  padding: 8px 16px;
`;

const SidebarCategoryHeader = styled(ListItem)`
  font-weight: bold;
  background: #f1f1f1;
`;

const SidebarFooter = styled.div`
  padding: 10px;
  text-align: center;
`;

const CategoryIcon = styled.img`
  width: 18px;
  height: 18px;
`;

// Emotion Styles for Specific Elements
const textSize = css`
  font-size: 13px;
`;

const iconSize = css`
  font-size: 16px !important;
`;

export default function MobileSidebar({ categories }) {
  return (
    <div className='mobile-sidebar'>
      <SidebarHeader className='mobile-sidebar-header'>
        <Link className='logo' to='/'>
          <img alt='logo' src="https://res.cloudinary.com/dshdu9ptb/image/upload/f_auto,q_auto/qhmsunu1zekm6a2l1you" className='mobile-sidebar-logo' css={css`max-height: 30px;`} />
        </Link>
      </SidebarHeader>

      <Divider />

      <SidebarNav className='mobile-sidebar-nav' dense>
        <SidebarItem component={Link} to='/' className='mobile-sidebar-item' dense>
          <ListItemIcon>
            <Home fontSize='small' css={iconSize} />
          </ListItemIcon>
          <ListItemText primary='Home' primaryTypographyProps={{ css: textSize }} />
        </SidebarItem>

        <SidebarItem component={Link} to='/shop' className='mobile-sidebar-item' dense>
          <ListItemIcon>
            <ShoppingBag fontSize='small' css={iconSize} />
          </ListItemIcon>
          <ListItemText primary='Shop' primaryTypographyProps={{ css: textSize }} />
        </SidebarItem>

        <Divider />

        <SidebarCategoryHeader className='mobile-sidebar-category-header' dense>
          <ListItemText primary='Categories' primaryTypographyProps={{ css: textSize, fontWeight: 600 }} />
        </SidebarCategoryHeader>

        {categories?.categories?.map(item => (
          <SidebarItem key={item._id} component={Link} to={`/shop?categories=${item._id}`} className='mobile-sidebar-category' dense>
            <ListItemIcon>
              <CategoryIcon className='category-icon' src={item?.image} alt='' />
            </ListItemIcon>
            <ListItemText primary={item?.name} primaryTypographyProps={{ css: textSize }} />
            {item.subcategories && item.subcategories.length > 0 && (
              <ArrowDropDown className='category-arrow' fontSize='small' css={iconSize} />
            )}
          </SidebarItem>
        ))}
      </SidebarNav>

      <Divider />

      <SidebarFooter className='mobile-sidebar-footer'>
        <Link to='/login' className='mobile-sidebar-login'>
          <Button className='btn-blue w-100' variant='contained' startIcon={<Person fontSize='small' css={iconSize} />} size='small'>
            Sign In
          </Button>
        </Link>
      </SidebarFooter>
    </div>
  );
}
