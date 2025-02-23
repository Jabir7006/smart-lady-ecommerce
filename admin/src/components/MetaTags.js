import { Helmet } from 'react-helmet-async';

export const ProductMetaTags = ({ product }) => (
  <Helmet>
    <title>{product.title} | Admin Dashboard</title>
    <meta name="description" content={product.description} />
    <meta property="og:title" content={product.title} />
    <meta property="og:description" content={product.description} />
    <meta property="og:image" content={product.images[0]?.url} />
  </Helmet>
); 