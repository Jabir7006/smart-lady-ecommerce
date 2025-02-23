import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import PageTitle from '../../components/Typography/PageTitle';
import {
  Card,
  CardBody,
  Button,
  Label,
  Input
} from '@windmill/react-ui';
import { useUpdateBrand, useGetBrand } from '../../hooks/useBrands';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import Icon from '../../components/Icon';
import { HomeIcon } from '../../icons';

const brandSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
});

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brandData, setBrandData] = useState({
    title: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: brand, isLoading } = useGetBrand(id);
  const updateBrand = useUpdateBrand();

  useEffect(() => {
    if (brand) {
      setBrandData({
        title: brand.title
      });
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Updating brand...');

    try {
      await brandSchema.validate(brandData, { abortEarly: false });
      await updateBrand.mutateAsync({
        id,
        data: brandData
      });
      toast.success('Brand updated successfully!', { id: loadingToast });
      navigate('/app/all-brands');
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
      toast.error(error.response?.data?.message || 'Error updating brand', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PageTitle>Edit Brand</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink to="/app/all-brands" className="mx-2">
            All Brands
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Edit Brand</p>
      </div>

      <Card className="max-w-xl mt-8 mx-auto">
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Label className="mb-4">
              <span>Title</span>
              <Input
                className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter brand title"
                name="title"
                value={brandData.title}
                onChange={(e) => setBrandData(prev => ({ ...prev, title: e.target.value }))}
              />
              {errors.title && (
                <span className="text-xs text-red-500">{errors.title}</span>
              )}
            </Label>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Updating...' : 'Update Brand'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditBrand;