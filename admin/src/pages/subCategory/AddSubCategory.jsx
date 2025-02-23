import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PageTitle from '../../components/Typography/PageTitle';
import {
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Select
} from '@windmill/react-ui';
import { useCreateSubCategory } from '../../hooks/useSubCategories';
import { useCategories } from '../../hooks/useCategories';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import Icon from '../../components/Icon';
import { HomeIcon } from '../../icons';

const subCategorySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  category: yup.string().required('Parent category is required'),
});

const AddSubCategory = () => {
  const navigate = useNavigate();
  const [subCategoryData, setSubCategoryData] = useState({
    name: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSubCategory = useCreateSubCategory();
  const { data: categoriesData } = useCategories({ limit: 100 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating subcategory...');

    try {
      await subCategorySchema.validate(subCategoryData, { abortEarly: false });
      await createSubCategory.mutateAsync(subCategoryData);
      toast.success('Subcategory created successfully!', { id: loadingToast });
      navigate('/app/all-sub-categories');
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
      toast.error(error.response?.data?.message || 'Error creating subcategory', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageTitle>Add New Sub Category</PageTitle>

       {/* Breadcrumb */}
       <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add new Sub Category</p>
      </div>

      <Card className="max-w-xl mt-8 mx-auto">
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Label className="mb-4">
              <span>Name</span>
              <Input
                className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter subcategory name"
                name="name"
                value={subCategoryData.name}
                onChange={(e) => setSubCategoryData(prev => ({ ...prev, name: e.target.value }))}
              />
              {errors.name && (
                <span className="text-xs text-red-500">{errors.name}</span>
              )}
            </Label>

            <Label className="mb-4">
              <span>Parent Category</span>
              <Select
                className={`mt-1 ${errors.category ? 'border-red-500' : ''}`}
                name="category"
                value={subCategoryData.category}
                onChange={(e) => setSubCategoryData(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select a category</option>
                {categoriesData?.categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <span className="text-xs text-red-500">{errors.category}</span>
              )}
            </Label>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Creating...' : 'Create Sub Category'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddSubCategory;