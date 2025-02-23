import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Textarea,
} from "@windmill/react-ui";
import { useCreateProduct } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useSubCategories } from "../hooks/useSubCategories";
import { useBrands } from "../hooks/useBrands";
import { uploadImages } from "../services/uploadService";
import toast from "react-hot-toast";
import * as yup from "yup";
import Icon from "../components/Icon";
import { HomeIcon } from "../icons";
import ImageUploader from "../components/ImageUploader";
import FormTitle from "../components/Typography/FormTitle";
import Select from "react-select";
import { useColors } from "../hooks/useColors";
import { useSizes } from "../hooks/useSizes";
import Toggle from "../components/Toggle";

const productSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  regularPrice: yup
    .number()
    .required("Regular price is required")
    .positive("Price must be positive"),
  discountPrice: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .lessThan(
      yup.ref("regularPrice"),
      "Discount price must be less than regular price"
    ),
  quantity: yup
    .number()
    .required("Quantity is required")
    .integer("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
  category: yup.string().required("Category is required"),
  subCategory: yup.string(),
  brand: yup.string().required("Brand is required"),
  color: yup.array().min(1, "At least one color is required"),
  tags: yup.string(),
  images: yup.array().min(1, "At least one image is required"),
  colors: yup.array().min(1, "At least one color is required"),
  sizes: yup.array().min(1, "At least one size is required"),
});

// Quill Editor Formats
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
  "color",
  "background",
];

// Quill Editor Modules (Toolbar Options)
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false, // Prevents unwanted HTML formatting
  },
  history: {
    delay: 2000,
    maxStack: 500,
    userOnly: true,
  },
};

// Custom styles for react-select
const customSelectStyles = {
  control: (provided, { isFocused, isDisabled }) => ({
    ...provided,
    backgroundColor: "#1a1c23",
    borderColor: "#4c4f52",
    borderRadius: "0.5rem",
    minHeight: "38px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#6b7280",
    },
    opacity: isDisabled ? 0.5 : 1,
  }),
  input: (provided) => ({
    ...provided,
    color: "#e5e7eb",
    "::placeholder": {
      color: "#6b7280",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6b7280",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#e5e7eb",
  }),
  option: (provided, { isSelected, isFocused }) => ({
    ...provided,
    backgroundColor: isSelected ? "#7e3af2" : isFocused ? "#374151" : "#1a1c23",
    color: "#e5e7eb",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#7e3af2",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#1a1c23",
    border: "1px solid #4c4f52",
    borderRadius: "0.5rem",
    zIndex: 50,
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#374151",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#e5e7eb",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#e5e7eb",
    "&:hover": {
      backgroundColor: "#7e3af2",
      color: "#e5e7eb",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#6b7280",
    "&:hover": {
      color: "#9ca3af",
    },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: "#4c4f52",
  }),
};

// Dark mode styles
const darkModeSelectStyles = {
  control: (provided, { isFocused, isDisabled }) => ({
    ...provided,
    backgroundColor: "#1a1c23",
    borderColor: isFocused ? "#7e3af2" : "#4c4f52",
    boxShadow: isFocused ? "0 0 0 2px #c4b5fd" : "none",
    "&:hover": {
      borderColor: isFocused ? "#7e3af2" : "#6b7280",
    },
    opacity: isDisabled ? 0.5 : 1,
  }),
  option: (provided, { isSelected, isFocused }) => ({
    ...provided,
    backgroundColor: isSelected ? "#7e3af2" : isFocused ? "#374151" : "#1a1c23",
    color: "white",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#7e3af2",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#374151",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "white",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "white",
    "&:hover": {
      backgroundColor: "#7e3af2",
      color: "white",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#1a1c23",
    zIndex: 50,
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    regularPrice: "",
    discountPrice: "",
    quantity: "",
    category: "",
    subCategory: "",
    brand: "",
    color: [],
    sizes: [],
    tags: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Fetch categories, subcategories, and brands
  const { data: categoriesData } = useCategories();
  const { data: subCategoriesData } = useSubCategories({
    category: productData.category,
    enabled: !!productData.category,
  });
  const { data: brandsData } = useBrands();
  const createProduct = useCreateProduct();

  // Get colors and sizes data
  const { data: colorsData } = useColors();
  const { data: sizesData } = useSizes();

  // Format options for react-select
  const colorOptions = colorsData?.data?.map((color) => ({
    value: color._id,
    label: color.title,
    color: color.title,
  }));

  const sizeOptions = sizesData?.data?.map((size) => ({
    value: size._id,
    label: size.title,
  }));

  // Format options for categories, subcategories, and brands
  const categoryOptions =
    categoriesData?.categories?.map((category) => ({
      value: category._id,
      label: category.name,
    })) || [];

  const subCategoryOptions =
    subCategoriesData?.subCategories?.map((subCategory) => ({
      value: subCategory._id,
      label: subCategory.name,
    })) || [];

  const brandOptions =
    brandsData?.brands?.map((brand) => ({
      value: brand._id,
      label: brand.title,
    })) || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "category") {
        newData.subCategory = "";
      }

      return newData;
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateImages = (files) => {
    const errors = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported image format`);
      }
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (max 5MB)`);
      }
    });

    return errors;
  };

  const validateForm = async () => {
    try {
      await productSchema.validate(
        {
          ...productData,
          images: selectedFiles,
        },
        { abortEarly: false }
      );
      return true;
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate files
    const validationErrors = validateImages(files);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    // Create preview URLs
    const filePreviewUrls = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...filePreviewUrls]);

    // Clear any previous image errors
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // If removing the last image, set the error
      if (newFiles.length === 0) {
        setErrors((prev) => ({
          ...prev,
          images: "At least one image is required",
        }));
      }
      return newFiles;
    });
  };

  const handleEditorChange = (content) => {
    setProductData((prev) => ({
      ...prev,
      description: content,
    }));

    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  // Handle color/size changes
  const handleColorChange = (selectedOptions) => {
    setSelectedColors(selectedOptions || []);
    setProductData((prev) => ({
      ...prev,
      color: selectedOptions?.map((option) => option.value) || [],
    }));
  };

  const handleSizeChange = (selectedOptions) => {
    setSelectedSizes(selectedOptions || []);
    setProductData((prev) => ({
      ...prev,
      sizes: selectedOptions?.map((option) => option.value) || [],
    }));
  };

  // Handle select changes
  const handleCategoryChange = (selectedOption) => {
    setProductData((prev) => ({
      ...prev,
      category: selectedOption?.value || "",
      subCategory: "", // Reset subcategory when category changes
    }));
  };

  const handleSubCategoryChange = (selectedOption) => {
    setProductData((prev) => ({
      ...prev,
      subCategory: selectedOption?.value || "",
    }));
  };

  const handleBrandChange = (selectedOption) => {
    setProductData((prev) => ({
      ...prev,
      brand: selectedOption?.value || "",
    }));
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating product...");

    try {
      if (selectedFiles.length > 0) {
        const files = selectedFiles.map((file) => file.file);
        const uploadResult = await uploadImages.mutateAsync(files);

        const slug = productData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        const finalProductData = {
          ...productData,
          images: uploadResult.data,
          slug,
          description: productData.description,
          ...(productData.subCategory
            ? { subCategory: productData.subCategory }
            : {}),
          colors: productData.color.map((c) => c.trim()).filter(Boolean),
          sizes: productData.sizes.map((s) => s.trim()).filter(Boolean),
          tags: productData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        };

        await createProduct.mutateAsync(finalProductData);
        toast.success("Product created successfully!", { id: loadingToast });
        navigate("/app/all-products");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating product", {
        id: loadingToast,
      });
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategoriesData?.subCategories || [];

  return (
    <div>
      <PageTitle>Add New Product</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add new Product</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="w-full mt-8 grid gap-4 grid-col md:grid-cols-3">
          <Card className="row-span-2 md:col-span-2">
            <CardBody>
              <ImageUploader
                onImageChange={handleImageChange}
                selectedFiles={selectedFiles}
                onRemoveImage={removeImage}
                error={errors.images}
              />

              <FormTitle>Product Title</FormTitle>
              <Label>
                <Input
                  className={`mb-1 ${errors.title ? "border-red-500" : ""}`}
                  placeholder="Type product title here"
                  name="title"
                  value={productData.title}
                  onChange={handleInputChange}
                  required
                />
                {errors.title && (
                  <span className="text-xs text-red-500">{errors.title}</span>
                )}
              </Label>

              <FormTitle>Description</FormTitle>
              <Label>
                <div
                  className={`mb-6 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ReactQuill
                    theme="snow"
                    value={productData.description}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    className="bg-white dark:bg-gray-900"
                    preserveWhitespace={true}
                  />
                  <style>
                    {`
                      .ql-container {
                        height: 350px !important;
                        border-bottom-left-radius: 0.5rem;
                        border-bottom-right-radius: 0.5rem;
                      }
                      .ql-editor {
                        min-height: 350px !important;
                      }
                      .ql-toolbar {
                        border-top-left-radius: 0.5rem;
                        border-top-right-radius: 0.5rem;
                        position: sticky;
                        top: 0;
                        z-index: 1;
                        background: white;
                      }
                      .dark .ql-toolbar {
                        background: #1a1c23;
                        border-color: #4c4f52;
                      }
                      .dark .ql-container {
                        border-color: #4c4f52;
                      }
                      .dark .ql-editor {
                        color: #e5e7eb;
                      }
                      .dark .ql-toolbar .ql-stroke {
                        stroke: #e5e7eb;
                      }
                      .dark .ql-toolbar .ql-fill {
                        fill: #e5e7eb;
                      }
                      .dark .ql-toolbar .ql-picker {
                        color: #e5e7eb;
                      }
                    `}
                  </style>
                </div>
                {errors.description && (
                  <span className="text-xs text-red-500">
                    {errors.description}
                  </span>
                )}
              </Label>

              <FormTitle>Regular Price</FormTitle>
              <Label>
                <Input
                  className={`mb-1 ${
                    errors.regularPrice ? "border-red-500" : ""
                  }`}
                  type="number"
                  placeholder="Enter regular price"
                  name="regularPrice"
                  value={productData.regularPrice}
                  onChange={handleInputChange}
                  required
                />
                {errors.regularPrice && (
                  <span className="text-xs text-red-500">
                    {errors.regularPrice}
                  </span>
                )}
              </Label>

              <FormTitle>Discount Price</FormTitle>
              <Label>
                <Input
                  className={`mb-1 ${
                    errors.discountPrice ? "border-red-500" : ""
                  }`}
                  type="number"
                  placeholder="Enter discount price"
                  name="discountPrice"
                  value={productData.discountPrice}
                  onChange={handleInputChange}
                />
                {errors.discountPrice && (
                  <span className="text-xs text-red-500">
                    {errors.discountPrice}
                  </span>
                )}
              </Label>

              <FormTitle>Stock Quantity</FormTitle>
              <Label>
                <Input
                  className={`mb-1 ${errors.quantity ? "border-red-500" : ""}`}
                  type="number"
                  placeholder="Enter product stock quantity"
                  name="quantity"
                  value={productData.quantity}
                  onChange={handleInputChange}
                  required
                />
                {errors.quantity && (
                  <span className="text-xs text-red-500">
                    {errors.quantity}
                  </span>
                )}
              </Label>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Label className="mb-4">
                <FormTitle>Category</FormTitle>
                <Select
                  className={`mt-1 ${errors.category ? "border-red-500" : ""}`}
                  options={categoryOptions}
                  value={
                    categoryOptions.find(
                      (option) => option.value === productData.category
                    ) || null
                  }
                  onChange={handleCategoryChange}
                  isLoading={!categoriesData}
                  placeholder="Select a category"
                  styles={{
                    ...customSelectStyles,
                    control: (provided, state) => ({
                      ...customSelectStyles.control(provided, state),
                      borderColor: errors.category
                        ? "#ef4444"
                        : state.isFocused
                        ? "#4c4f52"
                        : "#e5e7eb",
                    }),
                  }}
                />
                {errors.category && (
                  <span className="text-xs text-red-500">
                    {errors.category}
                  </span>
                )}
              </Label>

              <Label className="mb-4">
                <FormTitle>Sub Category</FormTitle>
                <Select
                  className={`mt-1 ${
                    errors.subCategory ? "border-red-500" : ""
                  }`}
                  options={subCategoryOptions}
                  value={
                    subCategoryOptions.find(
                      (option) => option.value === productData.subCategory
                    ) || null
                  }
                  onChange={handleSubCategoryChange}
                  isLoading={!subCategoriesData}
                  isDisabled={!productData.category}
                  placeholder={
                    productData.category
                      ? "Select a sub category (optional)"
                      : "Please select a category first"
                  }
                  styles={customSelectStyles}
                />
                {errors.subCategory && (
                  <span className="text-xs text-red-500">
                    {errors.subCategory}
                  </span>
                )}
              </Label>

              <Label className="mb-4">
                <FormTitle>Brand</FormTitle>
                <Select
                  className={`mt-1 ${errors.brand ? "border-red-500" : ""}`}
                  options={brandOptions}
                  value={
                    brandOptions.find(
                      (option) => option.value === productData.brand
                    ) || null
                  }
                  onChange={handleBrandChange}
                  isLoading={!brandsData}
                  placeholder="Select a brand"
                  styles={customSelectStyles}
                />
                {errors.brand && (
                  <span className="text-xs text-red-500">{errors.brand}</span>
                )}
              </Label>

              <FormTitle>Colors</FormTitle>
              <Label>
                <Select
                  isMulti
                  name="colors"
                  options={colorOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={selectedColors}
                  onChange={handleColorChange}
                  styles={customSelectStyles}
                />
                {errors.colors && (
                  <span className="text-xs text-red-500">{errors.colors}</span>
                )}
              </Label>

              <FormTitle>Sizes</FormTitle>
              <Label>
                <Select
                  isMulti
                  name="sizes"
                  options={sizeOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={selectedSizes}
                  onChange={handleSizeChange}
                  styles={customSelectStyles}
                />
                {errors.sizes && (
                  <span className="text-xs text-red-500">{errors.sizes}</span>
                )}
              </Label>

              <Label className="mb-4">
                <FormTitle>Tags</FormTitle>
                <Input
                  className={`mt-1 ${errors.tags ? "border-red-500" : ""}`}
                  name="tags"
                  placeholder="Enter tags (comma separated)"
                  value={productData.tags}
                  onChange={handleInputChange}
                />
                {errors.tags && (
                  <span className="text-xs text-red-500">{errors.tags}</span>
                )}
              </Label>

              <Label className="mb-4">
                <FormTitle>Featured Product</FormTitle>
                <div className="flex items-center mt-1">
                  <Toggle
                    enabled={productData.isFeatured}
                    onChange={handleToggleChange}
                    name="isFeatured"
                  />
                  <span className="ml-2">
                    {productData.isFeatured ? "Yes" : "No"}
                  </span>
                </div>
              </Label>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
