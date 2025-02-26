import ProductSlider from '../../../components/ui/ProductSlider';
import { useFeaturedProducts } from '../../../hooks/useProducts';

const RelatedProducts = () => {
  const { data: featuredProducts, isLoading: featuredLoading } =
  useFeaturedProducts();

  const productData = featuredProducts?.products; 
  return (
    <>
      <ProductSlider title='Related Products' description='Do not miss the current offers until the end of March.' itemView={5} products={productData} />
    </>
  );
};

export default RelatedProducts;
