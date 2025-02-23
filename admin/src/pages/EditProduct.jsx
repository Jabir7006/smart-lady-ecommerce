import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon, PublishIcon } from "../icons";
import toast from "react-hot-toast";
import * as yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, CardBody, Label, Input, Button } from "@windmill/react-ui";
import { useGetProduct, useUpdateProduct } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useSubCategories } from "../hooks/useSubCategories";
import { useBrands } from "../hooks/useBrands";
import Select from "react-select";
import { useColors } from "../hooks/useColors";
import { useSizes } from "../hooks/useSizes";
import Toggle from "../components/Toggle";

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

// Simplified validation schema for updates
const updateProductSchema = yup.object().shape({
  title: yup.string().min(3, "Title must be at least 3 characters"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters"),
  regularPrice: yup
    .number()
    .positive("Regular price must be positive")
    .typeError("Regular price must be a number"),
  discountPrice: yup
    .mixed()
    .transform((value) => {
      if (value === "") return null;
      const number = Number(value);
      return isNaN(number) ? undefined : number;
    })
    .nullable()
    .test(
      "is-less-than-regular",
      "Discount price must be less than regular price",
      function (value) {
        if (value === null || value === "") return true;
        return value < this.parent.regularPrice;
      }
    ),
  quantity: yup
    .number()
    .min(0, "Quantity cannot be negative")
    .integer("Quantity must be a whole number")
    .typeError("Quantity must be a number"),
  category: yup.string(),
  brand: yup.string().min(2, "Brand must be at least 2 characters"),
  colors: yup.array().min(1, "At least one color is required"),
  sizes: yup.array().min(1, "At least one size is required"),
});

const FormTitle = ({ children }) => (
  <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
    {children}
  </h2>
);

// Add these style objects at the top of your file after the imports
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

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading: isLoadingProduct } = useGetProduct(id);
  const updateProduct = useUpdateProduct();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    regularPrice: "",
    discountPrice: "",
    quantity: "",
    category: "",
    subCategory: "",
    brand: "",
    color: "",
    tags: "",
    isFeatured: false,
  });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const { data: categoriesData } = useCategories({ limit: 100 });
  const { data: subCategoriesData, isLoading: isLoadingSubCategories } =
    useSubCategories({
      category: productData.category,
      limit: 100,
    });
  const { data: brandsData } = useBrands({ limit: 100 });
  const { data: colorsData } = useColors();
  const { data: sizesData } = useSizes();

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

  useEffect(() => {
    if (response?.data) {
      const product = response.data;
      setProductData({
        title: product.title || "",
        description: product.description || "",
        regularPrice: product.regularPrice || "",
        discountPrice: product.discountPrice || "",
        quantity: product.quantity || "",
        category: product.category?._id || "",
        subCategory: product.subCategory?._id || "",
        brand: product.brand?._id || "",
        tags: Array.isArray(product.tags)
          ? product.tags.join(", ")
          : product.tags || "",
        isFeatured: product.isFeatured || false,
      });

      if (product.colors) {
        const initialColors = product.colors.map((color) => ({
          value: color._id,
          label: color.title,
          color: color.title,
        }));
        setSelectedColors(initialColors);
      }

      if (product.sizes) {
        const initialSizes = product.sizes.map((size) => ({
          value: size._id,
          label: size.title,
        }));
        setSelectedSizes(initialSizes);
      }
    }
  }, [response]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;

    if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    } else if (type === "select-one" && name === "isFeatured") {
      newValue = value === "true";
    }

    setProductData((prev) => {
      const newData = { ...prev, [name]: newValue };

      // Reset subCategory when category changes
      if (name === "category") {
        newData.subCategory = "";
      }

      return newData;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

  const handleColorChange = (selectedOptions) => {
    setSelectedColors(selectedOptions || []);
    setProductData((prev) => ({
      ...prev,
      colors: selectedOptions?.map((option) => option.value) || [],
    }));
  };

  const handleSizeChange = (selectedOptions) => {
    setSelectedSizes(selectedOptions || []);
    setProductData((prev) => ({
      ...prev,
      sizes: selectedOptions?.map((option) => option.value) || [],
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
    setIsSubmitting(true);
    const loadingToast = toast.loading("Updating product...");

    try {
      await updateProductSchema.validate(productData, { abortEarly: false });

      const formattedData = {
        ...productData,
        description: productData.description,
        ...(productData.subCategory
          ? { subCategory: productData.subCategory }
          : { subCategory: null }),
        colors: productData.colors || [],
        sizes: productData.sizes || [],
        tags: productData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        regularPrice: Number(productData.regularPrice),
        discountPrice: productData.discountPrice
          ? Number(productData.discountPrice)
          : 0,
        quantity: Number(productData.quantity),
      };

      await updateProduct.mutateAsync({
        id,
        data: formattedData,
      });

      toast.success("Product updated successfully!", { id: loadingToast });
      navigate("/app/all-products");
    } catch (error) {
      console.error("Update error:", error);
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        toast.error("Please check the form for errors", { id: loadingToast });
      } else {
        toast.error(error.response?.data?.message || "Error updating product", {
          id: loadingToast,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle>Edit Product</PageTitle>
        <NavLink to="/app/all-products" className="flex items-center gap-2">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <span>Back to Products</span>
        </NavLink>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="w-full mt-8 grid gap-4 grid-col md:grid-cols-3">
          <Card className="row-span-2 md:col-span-2">
            <CardBody>
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
                  onChange={handleInputChange}
                  isLoading={!categoriesData}
                  placeholder="Select a category"
                  styles={{
                    ...customSelectStyles,
                    control: (provided, state) => ({
                      ...customSelectStyles.control(provided, state),
                      borderColor: errors.category ? "#ef4444" : "#4c4f52",
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
                  onChange={handleInputChange}
                  isLoading={!subCategoriesData}
                  isDisabled={!productData.category}
                  placeholder={
                    productData.category
                      ? "Select a sub category (optional)"
                      : "Please select a category first"
                  }
                  styles={{
                    ...customSelectStyles,
                    control: (provided, state) => ({
                      ...customSelectStyles.control(provided, state),
                      borderColor: errors.subCategory ? "#ef4444" : "#4c4f52",
                    }),
                  }}
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
                  onChange={handleInputChange}
                  isLoading={!brandsData}
                  placeholder="Select a brand"
                  styles={{
                    ...customSelectStyles,
                    control: (provided, state) => ({
                      ...customSelectStyles.control(provided, state),
                      borderColor: errors.brand ? "#ef4444" : "#4c4f52",
                    }),
                  }}
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
                  styles={{
                    ...customSelectStyles,
                    control: (provided, state) => ({
                      ...customSelectStyles.control(provided, state),
                      borderColor: errors.colors ? "#ef4444" : "#4c4f52",
                    }),
                  }}
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
                  styles={{
                    ...customSelectStyles,
                    control: (provided, state) => ({
                      ...customSelectStyles.control(provided, state),
                      borderColor: errors.sizes ? "#ef4444" : "#4c4f52",
                    }),
                  }}
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
                {errors.isFeatured && (
                  <span className="text-xs text-red-500">
                    {errors.isFeatured}
                  </span>
                )}
              </Label>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
