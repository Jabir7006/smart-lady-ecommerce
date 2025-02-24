import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import GlobalContext from './context/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemedSuspense from './components/ThemedSuspense';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import TrackOrders from './pages/Profile/TrackOrders';
import Settings from './pages/Profile/Settings';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProductModal = lazy(() => import('./components/Modals/ProductModal'));
const Orders = lazy(() => import('./pages/Profile/Orders'));
const OrderDetails = lazy(() => import('./pages/Profile/OrderDetails'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      suspense: false,
    },
  },
});

function App() {
  const [isOpenProductModal, setisOpenProductModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productId, setProductId] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster position='top-center' />
          <GlobalContext.Provider
            value={{
              isOpenProductModal,
              setisOpenProductModal,

              sidebarOpen,
              toggleSidebar,
              productId,
              setProductId,
            }}
          >
            <Suspense fallback={<ThemedSuspense />}>
              <Routes>
                {/* Main App Routes */}
                <Route element={<MainLayout />}>
                  <Route path='/' element={<Home />} />
                  <Route path='/shop' element={<Shop />} />
                  <Route path='/product/:id' element={<ProductDetails />} />
                  <Route path='/cart' element={<Cart />} />
                  <Route path='/wishlist' element={<Wishlist />} />
                  <Route element={<PrivateRoute />}>
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/profile/orders' element={<Orders />} />
                    <Route
                      path='/profile/orders/:orderId'
                      element={<OrderDetails />}
                    />
                    <Route path='/profile/settings' element={<Settings />} />
                    <Route
                      path='/profile/track-orders'
                      element={<TrackOrders />}
                    />
                    <Route path='/checkout' element={<Checkout />} />
                  </Route>
                </Route>
                <Route element={<AuthLayout />}>
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />
                </Route>
                <Route path='*' element={<NotFound />} />
              </Routes>
              {isOpenProductModal && <ProductModal />}
            </Suspense>
          </GlobalContext.Provider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
