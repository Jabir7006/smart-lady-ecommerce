import { MdDashboard, FaUsers, FaTruck, FaTicketAlt, FiSettings, FaTag, FaBriefcase, FaShoppingCart, IoColorPalette } from 'react-icons/all';

export const navItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: <MdDashboard />,
  },
  {
    title: 'Products',
    url: '/admin/dashboard/products',
    icon: <FaShoppingCart />,
    children: [
      {
        title: 'All Products',
        url: '/admin/dashboard/products',
      },
      {
        title: 'Add Product',
        url: '/admin/dashboard/products/add',
      },
    ],
  },
  {
    title: 'Categories',
    url: '/admin/dashboard/categories',
    icon: <FaTag />,
    children: [
      {
        title: 'All Categories',
        url: '/admin/dashboard/categories',
      },
      {
        title: 'Add Category',
        url: '/admin/dashboard/categories/add',
      },
    ],
  },
  {
    title: 'Colors',
    url: '/admin/dashboard/colors',
    icon: <IoColorPalette />,
    children: [
      {
        title: 'All Colors',
        url: '/admin/dashboard/colors',
      },
      {
        title: 'Add Color',
        url: '/admin/dashboard/colors/add',
      },
    ],
  },
  {
    title: 'Customers',
    url: '/admin/dashboard/customers',
    icon: <FaUsers />,
  },
  {
    title: 'Orders',
    url: '/admin/dashboard/orders',
    icon: <FaTruck />,
  },
  {
    title: 'Coupons',
    url: '/admin/dashboard/coupons',
    icon: <FaTicketAlt />,
  },
  {
    title: 'Staff',
    url: '/admin/dashboard/staff',
    icon: <FaBriefcase />,
  },
  {
    title: 'Settings',
    url: '/admin/dashboard/settings',
    icon: <FiSettings />,
  },
];
