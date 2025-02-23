import api from "../utils/axios";

export const productApi = {
  // Fetch all products with pagination and filters
  getAllProducts: async ({
    page = 1,
    limit = 10,
    search = "",
    sort = "",
    order = "desc",
    filters = {},
  }) => {
    const queryParams = new URLSearchParams();

    // Add basic pagination params
    queryParams.append("page", String(page));
    queryParams.append("limit", String(limit));

    // Add search if present
    if (search) {
      queryParams.append("search", search);
    }

    // Add sort and order if present
    if (sort) {
      queryParams.append("sort", sort);
      queryParams.append("order", order);
    }

    // Add any additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, String(value));
      }
    });

    return await api.get(`/products?${queryParams}`);
  },

  // Get single product by ID
  getProduct: async (id) => {
    return await api.get(`/products/${id}`);
  },

  // Create new product
  createProduct: async (data) => {
    // Ensure colors and sizes are arrays
    const productData = {
      ...data,
      colors: Array.isArray(data.colors) ? data.colors : [],
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
    };

    return await api.post("/products", productData);
  },

  // Upload images
  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    return await api.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete product
  deleteProduct: async (id) => {
    return await api.delete(`/products/${id}`);
  },

  // Update product
  updateProduct: async ({ id, data }) => {
    return await api.patch(`/products/${id}`, data);
  },
};
