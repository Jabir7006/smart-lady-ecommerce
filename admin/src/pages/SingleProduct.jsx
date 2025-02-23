import React, { useState, useMemo, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

// Third-party component imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '../styles/swiper.css';

// Local component imports
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon } from "../icons";
import { Card, CardBody, Badge, Button } from "@windmill/react-ui";
import { useGetProduct } from "../hooks/useProducts";
import { formatPrice } from "../utils/formatPrice";
import { ProductMetaTags } from '../components/MetaTags';
import RichTextDisplay from "../components/RichTextDisplay";

const SingleProduct = () => {
  const { id } = useParams();
  const { data: response, isLoading, error } = useGetProduct(id);
  const [tabView, setTabView] = useState("description");
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Get the product from the nested response
  const product = response?.data;

  // Memoize the Swiper components
  const MainSwiper = useMemo(() => (
    <Swiper
      spaceBetween={10}
      navigation={true}
      thumbs={{ swiper: thumbsSwiper }}
      modules={[FreeMode, Navigation, Thumbs]}
      className="mb-4"
    >
      {product?.images?.map((image, index) => (
        <SwiperSlide key={image.public_id || index}>
          <img
            src={image.url}
            alt={`${product.title} ${index + 1}`}
            className="w-full h-[400px] object-cover rounded-lg"
            loading="lazy"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  ), [product?.images, thumbsSwiper]);

  useEffect(() => {
    return () => {
      if (thumbsSwiper) {
        thumbsSwiper.destroy();
      }
    };
  }, [thumbsSwiper]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="text-xl font-semibold">Error loading product</p>
          <p className="mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-xl font-semibold">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {product && <ProductMetaTags product={product} />}
      <PageTitle>Product Details</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <NavLink exact to="/app/all-products" className="mx-2 text-purple-600">
          All Products
        </NavLink>
        {">"}
        <p className="mx-2">{product.title}</p>
      </div>

      {/* Product overview  */}
      <Card className="my-8 shadow-md">
        <CardBody>
          <div className="grid grid-col items-center md:grid-cols-2 lg:grid-cols-2">
            <div>
              {product?.images && product.images.length > 0 && (
                <>
                  {MainSwiper}

                  {/* Thumbnail Swiper */}
                  {product.images.length > 1 && (
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="thumbs-swiper"
                    >
                      {product.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg cursor-pointer"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </>
              )}
            </div>

            <div className="mx-8 pt-5 md:pt-0">
              <h1 className="text-3xl mb-4 font-semibold text-gray-700 dark:text-gray-200">
                {product.title}
              </h1>

              <Badge
                type={product.quantity > 0 ? "success" : "danger"}
                className="mb-2"
              >
                <p className="break-normal">
                  {product.quantity > 0 ? `In Stock (${product.quantity})` : "Out of Stock"}
                </p>
              </Badge>


              <RichTextDisplay content={product.description} />


              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-400">
                  Category: <span className="font-normal">{product.category?.name}</span>
                </p>
                {product.subCategory && (
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-400">
                    Sub Category: <span className="font-normal">{product.subCategory?.name}</span>
                  </p>
                )}
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-400">
                  Brand: <span className="font-normal">{product.brand?.title}</span>
                </p>
                {product.color && product.color.length > 0 && (
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-400">
                    Colors: <span className="font-normal">{Array.isArray(product.color) ? product.color.join(", ") : product.color}</span>
                  </p>
                )}
                {product.tags && product.tags.length > 0 && (
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-400">
                    Tags: <span className="font-normal">{Array.isArray(product.tags) ? product.tags.join(", ") : product.tags}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <h4 className="text-purple-600 text-2xl font-semibold">
                  {formatPrice(product.regularPrice)}
                </h4>
                {product.discountPrice > 0 && (
                  <h4 className="text-gray-500 text-xl line-through">
                    {formatPrice(product.discountPrice)}
                  </h4>
                )}
              </div>

              {product.isFeatured && (
                <Badge type="primary" className="mt-2">
                  Featured Product
                </Badge>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Product Reviews and Description */}
      <Card className="my-8 shadow-md">
        <CardBody>
          {/* Navigation Area */}
          <div className="flex items-center border-b">
            <Button
              className={`mx-5 ${tabView === "description" ? "text-purple-600" : ""}`}
              layout="link"
              onClick={() => setTabView("description")}
            >
              Description
            </Button>
            <Button 
              className={`mx-5 ${tabView === "reviews" ? "text-purple-600" : ""}`}
              layout="link"
              onClick={() => setTabView("reviews")}
            >
              Reviews
            </Button>
          </div>

          {/* Component area */}
          <div className="mx-3 mt-4">
            {tabView === "description" ? (
              <div className=" text-gray-600 dark:text-gray-400 max-w-none">
                <RichTextDisplay content={product.description} />
              </div>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  Reviews coming soon...
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SingleProduct;
