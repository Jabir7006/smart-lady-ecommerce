import React, { useState, useEffect, useCallback } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink } from "react-router-dom";
import {
  EditIcon,
  EyeIcon,
  GridViewIcon,
  HomeIcon,
  ListViewIcon,
  TrashIcon,
} from "../icons";
import {
  Card,
  CardBody,
  Label,
  Select,
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import Icon from "../components/Icon";
import { genRating } from "../utils/genarateRating";
import { useProducts, useDeleteProduct } from "../hooks/useProducts";
import toast from "react-hot-toast";
import ThemedSuspense from "../components/ThemedSuspense";
import EmptyState from "../components/EmptyState";
import { useCategories } from "../hooks/useCategories";
import { cacheService } from "../services/cacheService";
import { errorTracker } from "../services/errorTracking";
import { performanceMonitor } from "../services/performanceMonitoring";
import { productApi } from "../services/productService";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const ProductsAll = () => {
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: categoriesData } = useCategories({ limit: 100 });

  const { data, isLoading, error } = useProducts({
    page,
    limit: resultsPerPage,
    search,
    sort: sortField,
    order: sortOrder,
    filters: selectedCategory ? { category: selectedCategory } : undefined,
  });

  const deleteProduct = useDeleteProduct();

  // Delete action model
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Start performance monitoring
  useEffect(() => {
    performanceMonitor.startMeasure("products-page-load");
    return () => performanceMonitor.endMeasure("products-page-load");
  }, []);

  // Cache products data
  const fetchProducts = useCallback(() => {
    return productApi.getAllProducts({
      page,
      limit: resultsPerPage,
      search,
      sort: sortField,
      order: sortOrder,
      filters: selectedCategory ? { category: selectedCategory } : undefined,
    });
  }, [page, resultsPerPage, search, sortField, sortOrder, selectedCategory]);

  const getCachedProducts = useCallback(async () => {
    const cacheKey = `products-${page}-${resultsPerPage}-${search}-${sortField}-${sortOrder}-${selectedCategory}`;
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await fetchProducts();
      cacheService.set(cacheKey, response);
      return response;
    } catch (error) {
      errorTracker.captureError(error, {
        component: "ProductsAll",
        action: "fetchProducts",
        params: {
          page,
          resultsPerPage,
          search,
          sortField,
          sortOrder,
          selectedCategory,
        },
      });
      throw error;
    }
  }, [
    page,
    resultsPerPage,
    search,
    sortField,
    sortOrder,
    selectedCategory,
    fetchProducts,
  ]);

  // Handle delete with error tracking
  const handleDelete = async () => {
    setIsDeleting(true);
    const loadingToast = toast.loading("Deleting product...");

    try {
      performanceMonitor.startMeasure("delete-product");
      await deleteProduct.mutateAsync(productToDelete);
      performanceMonitor.endMeasure("delete-product");

      toast.success("Product deleted successfully!", {
        id: loadingToast,
        duration: 2000,
      });
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      errorTracker.captureError(error, {
        component: "ProductsAll",
        action: "deleteProduct",
        productId: productToDelete,
      });
      toast.error(error.response?.data?.message || "Error deleting product", {
        id: loadingToast,
        duration: 2000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  // Handle list view
  const handleChangeView = () => {
    if (view === "list") {
      setView("grid");
    }
    if (view === "grid") {
      setView("list");
    }
  };

  const handlePageChange = (p) => {
    setPage(p);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case "priceAsc":
        setSortField("discountPrice");
        setSortOrder("asc");
        break;
      case "priceDesc":
        setSortField("discountPrice");
        setSortOrder("desc");
        break;
      case "newest":
        setSortField("createdAt");
        setSortOrder("desc");
        break;
      case "oldest":
        setSortField("createdAt");
        setSortOrder("asc");
        break;
      default:
        setSortField("createdAt");
        setSortOrder("desc");
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (isLoading) return <ThemedSuspense />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <PageTitle>All Products</PageTitle>

      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Products</p>
      </div>

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All Products
              </p>

              <Label className="mx-3">
                <Select
                  className="py-3"
                  onChange={handleSortChange}
                  value={
                    sortField === "createdAt"
                      ? sortOrder === "desc"
                        ? "newest"
                        : "oldest"
                      : sortField === "discountPrice"
                      ? sortOrder === "desc"
                        ? "priceDesc"
                        : "priceAsc"
                      : "newest"
                  }
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </Select>
              </Label>

              <Label className="mx-3">
                <Select
                  className="py-3"
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  <option value="">All Categories</option>
                  {categoriesData?.categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Label>

              <Label className="mr-8">
                {/* <!-- focus-within sets the color for the icon when input is focused --> */}
                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                  <input
                    className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Number of Results"
                    value={resultsPerPage}
                    onChange={(e) => setResultsPerPage(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                    {/* <SearchIcon className="w-5 h-5" aria-hidden="true" /> */}
                    Results on {`${view}`}
                  </div>
                </div>
              </Label>
            </div>
            <div className="">
              <Button
                icon={view === "list" ? ListViewIcon : GridViewIcon}
                className="p-2"
                aria-label="Edit"
                onClick={handleChangeView}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Delete product model */}
      <DeleteConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        title="Product"
        handleDelete={handleDelete}
      />
      {/* Product Views */}
      {view === "list" ? (
        <>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>QTY</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Action</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {data.products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="hidden mr-4 md:block"
                          src={product?.images[0]?.url}
                          alt="Product image"
                        />
                        <div>
                          <p className="font-semibold">
                            {product.title.substring(0, 20)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product?.category?.name || "-"}</TableCell>

                    <TableCell>{product?.brand?.title || "-"}</TableCell>
                    <TableCell>
                      <Badge type={product.quantity > 0 ? "success" : "danger"}>
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {genRating(product.rating || 0, 0, 5)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {product.quantity}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex flex-col">
                        <span className="line-through text-gray-500">
                          ${product.regularPrice}
                        </span>
                        <span className="font-bold text-purple-600">
                          ${product.discountPrice}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex">
                        <Link to={`/app/product/${product._id}`}>
                          <Button
                            icon={EyeIcon}
                            className="mr-3"
                            aria-label="Preview"
                          />
                        </Link>
                        <Link to={`/app/product/edit/${product._id}`}>
                          <Button
                            icon={EditIcon}
                            className="mr-3"
                            layout="outline"
                            aria-label="Edit"
                          />
                        </Link>
                        <Button
                          icon={TrashIcon}
                          layout="outline"
                          onClick={() => openDeleteModal(product._id)}
                          disabled={isDeleting}
                          className={`${
                            isDeleting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          aria-label="Delete"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={data.total}
                resultsPerPage={resultsPerPage}
                label="Table navigation"
                onChange={handlePageChange}
              />
            </TableFooter>
          </TableContainer>
        </>
      ) : (
        <>
          {/* Card list */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {data.products.map((product) => (
              <div className="h-full" key={product._id}>
                <Card className="h-full flex flex-col">
                  <img
                    className="object-cover w-full h-48"
                    src={product?.images[0]?.url}
                    alt="product"
                  />
                  <CardBody className="flex flex-col flex-grow">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-semibold truncate text-gray-600 dark:text-gray-300">
                        {product.title.substring(0, 15)}...
                      </p>
                      <Badge
                        type={product.quantity > 0 ? "success" : "danger"}
                        className="whitespace-nowrap"
                      >
                        <p className="break-normal">
                          {product.quantity > 0 ? `In Stock` : "Out of Stock"}
                        </p>
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-lg font-bold text-gray-700 dark:text-gray-300 line-through">
                        ${product.regularPrice}
                      </span>
                      <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        ${product.discountPrice}
                      </span>
                    </div>
                    <p className="mb-8 text-gray-600 dark:text-gray-400 flex-grow">
                      Category: {product.category?.name}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <Link to={`/app/product/${product._id}`}>
                          <Button
                            icon={EyeIcon}
                            className="mr-3"
                            aria-label="Preview"
                            size="small"
                          />
                        </Link>
                      </div>
                      <div>
                        <Link to={`/app/product/edit/${product._id}`}>
                          <Button
                            icon={EditIcon}
                            className="mr-3"
                            layout="outline"
                            aria-label="Edit"
                            size="small"
                          />
                        </Link>
                        <Button
                          icon={TrashIcon}
                          layout="outline"
                          onClick={() => openDeleteModal(product._id)}
                          disabled={isDeleting}
                          size="small"
                          className={`${
                            isDeleting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>

          <Pagination
            totalResults={data.total}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={handlePageChange}
          />
        </>
      )}

      {!isLoading && (!data?.products || data.products.length === 0) && (
        <EmptyState
          title="No products found"
          message="Get started by creating your first product"
          actionLink="/app/add-product"
          actionText="Add Product"
        />
      )}
    </div>
  );
};

export default ProductsAll;
