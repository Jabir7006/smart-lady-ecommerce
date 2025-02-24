import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/Typography/PageTitle";
import { Input, Label, Button } from "@windmill/react-ui";
import { createAdmin } from "../../services/userService";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { HomeIcon } from "../../icons";

const AddAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createAdmin(formData);
      toast.success("Admin created successfully!");
      navigate("/app/admins");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-6 mx-auto grid">
      <div className="flex justify-between items-center">
        <PageTitle>Create New Admin</PageTitle>
        <NavLink
          to="/app/admins"
          className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
        >
          Back to Admins
        </NavLink>
      </div>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300 mb-6">
        <div className="flex items-center text-purple-600">
          <HomeIcon className="w-5 h-5" aria-hidden="true" />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <NavLink to="/app/admins" className="mx-2">
          Admins
        </NavLink>
        {">"}
        <p className="mx-2">Create Admin</p>
      </div>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-8">
            {/* Full Name */}
            <Label>
              <span className="text-gray-700 dark:text-gray-400">
                Full Name
              </span>
              <Input
                className="mt-1"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </Label>

            {/* Email */}
            <Label>
              <span className="text-gray-700 dark:text-gray-400">Email</span>
              <Input
                className="mt-1"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@example.com"
              />
            </Label>

            {/* Password */}
            <Label>
              <span className="text-gray-700 dark:text-gray-400">Password</span>
              <Input
                className="mt-1"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Password must be at least 8 characters long and contain
                uppercase, lowercase, number and special character
              </span>
            </Label>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
