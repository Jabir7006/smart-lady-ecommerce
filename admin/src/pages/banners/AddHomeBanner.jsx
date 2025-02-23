import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Label } from "@windmill/react-ui";
import { useCreateHomeBanner } from "../../hooks/useHomeBanners";
import toast from "react-hot-toast";

const AddHomeBanner = () => {
  const navigate = useNavigate();
  const [bannerData, setBannerData] = useState({ image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const createHomeBanner = useCreateHomeBanner();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerData({ ...bannerData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setBannerData({ image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", bannerData.image);

    try {
      await createHomeBanner.mutateAsync(formData);
      toast.success("Home banner created successfully!");
      navigate("/app/home-banner/all");
    } catch (error) {
      toast.error("Error creating home banner");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">Media And Published</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg">
        <Label className="mb-4">
          <span>Image</span>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1"
          />
        </Label>

        {imagePreview && (
          <div className="relative mb-4">
            <button
              type="button"
              onClick={handleImageRemove}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1"
            >
              &times; {/* Close icon */}
            </button>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-32 object-cover rounded"
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={!bannerData.image || createHomeBanner.isPending}
          className="w-full bg-blue-600"
        >
          PUBLISH AND VIEW
        </Button>
      </form>
    </div>
  );
};

export default AddHomeBanner;
