import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Orders = lazy(() => import("../pages/Orders"));
const OrderDetailsPage = lazy(() => import("../pages/OrderDetailsPage"));
const ProductsAll = lazy(() => import("../pages/ProductsAll"));
const SingleProduct = lazy(() => import("../pages/SingleProduct"));
const AddProduct = lazy(() => import("../pages/AddProduct"));
const Customers = lazy(() => import("../pages/Customers"));
const Chats = lazy(() => import("../pages/Chats"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
const EditProduct = lazy(() => import("../pages/EditProduct"));
const CategoriesAll = lazy(() => import("../pages/category/CategoriesAll"));
const AddCategory = lazy(() => import("../pages/category/AddCategory"));
const EditCategory = lazy(() => import("../pages/category/EditCategory"));
const EditSubCategory = lazy(() =>
  import("../pages/subCategory/EditSubCategory")
);
const SubCategoriesAll = lazy(() =>
  import("../pages/subCategory/SubCategoriesAll")
);
const AddSubCategory = lazy(() =>
  import("../pages/subCategory/AddSubCategory")
);
const EditBrand = lazy(() => import("../pages/brand/EditBrand"));
const BrandsAll = lazy(() => import("../pages/brand/AllBrands"));
const AddBrand = lazy(() => import("../pages/brand/AddBrand"));
const AddColor = lazy(() => import("../pages/color/AddColor"));
const AddSize = lazy(() => import("../pages/sizes/AddSizes"));
const AddHomeBanner = lazy(() => import("../pages/banners/AddHomeBanner"));
const AllHomeBanners = lazy(() => import("../pages/banners/AllHomeBanners"));

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "dashboard",
    component: Dashboard,
  },
  {
    path: "home-banner/add",
    component: AddHomeBanner,
  },
  {
    path: "home-banner/all",
    component: AllHomeBanners,
  },
  {
    path: "orders",
    component: Orders,
  },
  {
    path: "order/:id",
    component: OrderDetailsPage,
  },
  {
    path: "all-products",
    component: ProductsAll,
  },
  {
    path: "add-product",
    component: AddProduct,
  },
  {
    path: "product-color",
    component: AddColor,
  },
  {
    path: "product-size",
    component: AddSize,
  },
  {
    path: "product/:id",
    component: SingleProduct,
  },
  {
    path: "all-categories",
    component: CategoriesAll,
  },
  {
    path: "add-category",
    component: AddCategory,
  },
  {
    path: "all-sub-categories",
    component: SubCategoriesAll,
  },
  {
    path: "add-sub-category",
    component: AddSubCategory,
  },
  {
    path: "all-brands",
    component: BrandsAll,
  },
  {
    path: "add-brand",
    component: AddBrand,
  },
  {
    path: "customers",
    component: Customers,
  },
  {
    path: "chats",
    component: Chats,
  },
  {
    path: "manage-profile",
    component: Profile,
  },
  {
    path: "settings",
    component: Settings,
  },
  {
    path: "404",
    component: Page404,
  },
  {
    path: "blank",
    component: Blank,
  },
  {
    path: "/app/product/edit/:id",
    component: EditProduct,
  },
  {
    path: "/app/category/edit/:id",
    component: EditCategory,
  },
  {
    path: "/app/subcategory/edit/:id",
    component: EditSubCategory,
  },
  {
    path: "/app/brand/edit/:id",
    component: EditBrand,
  },
];

export default routes;
