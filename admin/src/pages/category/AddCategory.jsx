import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PageTitle from "../../components/Typography/PageTitle";
import {
  Card,
  CardBody,
  Input,
  Label,
  Button,
} from '@windmill/react-ui';
import { useCreateCategory } from '../../hooks/useCategories';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { HomeIcon } from '../../icons';
import Icon from '../../components/Icon';

const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  color: yup
    .string()
    .required('Color is required')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
});

const AddCategory = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [categoryData, setCategoryData] = useState({
    name: '',
    color: '#FEEFEA',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const createCategory = useCreateCategory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating category...');

    try {
      // Validate form data
      await categorySchema.validate(
        { name: categoryData.name, color: categoryData.color }, 
        { abortEarly: false }
      );

      // Create FormData
      const formData = new FormData();
      formData.append('name', categoryData.name);
      formData.append('color', categoryData.color);
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      await createCategory.mutateAsync(formData);
      toast.success('Category created successfully!', { id: loadingToast });
      navigate('/app/all-categories');
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        toast.error('Please check the form for errors', { id: loadingToast });
      } else {
        toast.error(error.response?.data?.message || 'Error creating category', { id: loadingToast });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageTitle>Add New Category</PageTitle>

        {/* Breadcrumb */}
        <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add new Category</p>
      </div>

      <Card className="max-w-xl mt-8 mx-auto">
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Label className="mb-4">
              <span>Name</span>
              <Input
                className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter category name"
                name="name"
                value={categoryData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <span className="text-xs text-red-500">{errors.name}</span>
              )}
            </Label>

            <Label className="mb-4">
              <span>Color</span>
              <Input
                className={`mt-1 ${errors.color ? 'border-red-500' : ''}`}
                type="color"
                name="color"
                value={categoryData.color}
                onChange={handleInputChange}
              />
              {errors.color && (
                <span className="text-xs text-red-500">{errors.color}</span>
              )}
            </Label>

            <Label className="mb-4">
              <span>Image</span>
              <div className="mt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100"
                />
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </Label>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddCategory;
