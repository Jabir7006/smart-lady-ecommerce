import api from '../utils/axios';

export const categoryApi = {
  getAllCategories: async ({ page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc' }) => {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
      ...(sort && { sort }),
      ...(order && { order })
    });

    return await api.get(`/categories?${queryParams}`);
  },

  getCategory: async (id) => {
    return await api.get(`/categories/${id}`);
  },

  createCategory: async (formData) => {
    // First upload the image if it exists
    let imageUrl = '';
    let imageId = '';
    
    if (formData.get('image')) {
      const imageFormData = new FormData();
      imageFormData.append('image', formData.get('image'));
      
      const uploadResponse = await api.post('/uploads/single', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      imageUrl = uploadResponse.data.url;
      imageId = uploadResponse.data.public_id;
    }

    // Then create the category with the image URL and ID
    const categoryData = {
      name: formData.get('name'),
      color: formData.get('color'),
      image: imageUrl,
      imageId: imageId
    };

    return await api.post('/categories', categoryData);
  },

  updateCategory: async ({ id, data }) => {
    try {
      let imageUrl = '';
      let imageId = '';
      
      if (data.get('image') instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append('image', data.get('image'));
        
        const uploadResponse = await api.post('/uploads/single', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        imageUrl = uploadResponse.data.url;
        imageId = uploadResponse.data.public_id;
      }

      const updateData = {
        name: data.get('name'),
        color: data.get('color'),
        ...(imageUrl && { image: imageUrl }),
        ...(imageId && { imageId: imageId })
      };

      return await api.put(`/categories/${id}`, updateData);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    return await api.delete(`/categories/${id}`);
  }
};