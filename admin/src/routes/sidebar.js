/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  
  {
    path: "/app/orders",
    icon: "CartIcon",
    name: "Orders",
  },
  {
    icon: "PeopleIcon",
    name: "User Management",
    routes: [
      {
        path: "/app/customers",
        name: "Customers",
      },
      {
        path: "/app/admins",
        name: "Admins",
      },
      {
        path: "/app/add-admin",
        name: "Add Admin",
      },
    ],
  },
  {
    icon: "FormsIcon",
    name: "Products",
    routes: [
      {
        path: "/app/all-products",
        name: "All Products",
      },
      {
        path: "/app/add-product",
        name: "Add Product",
      },
      {
        path: "/app/product-color",
        name: "Add Color",
      },
      {
        path: "/app/product-size",
        name: "Add Size",
      },
    ],
  },
  {
    icon: "CardsIcon",
    name: "Categories",
    routes: [
      {
        path: "/app/all-categories",
        name: "All Categories",
      },
      {
        path: "/app/add-category",
        name: "Add Category",
      },
    ],
  },
  {
    icon: "ModalsIcon",
    name: "Sub Categories",
    routes: [
      {
        path: "/app/all-sub-categories",
        name: "All Sub Categories",
      },
      {
        path: "/app/add-sub-category",
        name: "Add Sub Category",
      },
    ],
  },
  {
    icon: "TablesIcon",
    name: "Brands",
    routes: [
      {
        path: "/app/all-brands",
        name: "All Brands",
      },
      {
        path: "/app/add-brand",
        name: "Add Brand",
      },
    ],
  },
  {
    icon: "PagesIcon",
    name: "Home Banner",
    routes: [
      {
        path: "/app/home-banner/all",
        name: "All Banners",
      },
      {
        path: "/app/home-banner/add",
        name: "Add Banner",
      },
    ],
  },
  {
    path: "/app/chats",
    icon: "ChatIcon",
    name: "Chats",
  },
  {
    path: "/app/manage-profile",
    icon: "OutlinePersonIcon",
    name: "Profile",
  },
  {
    path: "/app/settings",
    icon: "OutlineCogIcon",
    name: "Settings",
  },
  {
    path: "/app/logout",
    icon: "OutlineLogoutIcon",
    name: "Logout",
  },
];

export default routes;
