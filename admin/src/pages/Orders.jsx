import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import { HomeIcon, MoneyIcon, CartIcon, PeopleIcon } from "../icons";
import { Card, CardBody, Label, Select } from "@windmill/react-ui";
import OrdersTable from "../components/OrdersTable";
import {
  getAllOrders,
  getOrderStats,
  updateOrderStatus,
} from "../services/orderService";
import InfoCard from "../components/Cards/InfoCard";
import { toast } from "react-hot-toast";

function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const Orders = () => {
  const [resultsPerPage, setResultPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.orders || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getOrderStats();
      setStats(response.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleFilter = (filter_name) => {
    setFilter(filter_name.toLowerCase());
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders and stats after status update
      await Promise.all([fetchOrders(), fetchStats()]);
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div>
      <PageTitle>Orders</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Orders</p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardBody className="flex items-center">
            <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
              <Icon className="w-5 h-5" aria-hidden="true" icon={CartIcon} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {stats.totalOrders}
              </p>
              <p className="text-sm text-green-500">All time orders</p>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardBody className="flex items-center">
            <div className="p-3 mr-4 text-yellow-500 bg-yellow-100 rounded-full dark:text-yellow-100 dark:bg-yellow-500">
              <Icon className="w-5 h-5" aria-hidden="true" icon={PeopleIcon} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Orders
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {stats.pendingOrders}
              </p>
              <p className="text-sm text-orange-500">Needs attention</p>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardBody className="flex items-center">
            <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
              <Icon className="w-5 h-5" aria-hidden="true" icon={CartIcon} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed Orders
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {stats.completedOrders}
              </p>
              <p className="text-sm text-green-500">Successfully delivered</p>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardBody className="flex items-center">
            <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
              <Icon className="w-5 h-5" aria-hidden="true" icon={MoneyIcon} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-500">All time earnings</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Filter Orders
            </p>

            <Label className="mx-3">
              <Select
                className="py-3"
                onChange={(e) => handleFilter(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </Select>
            </Label>

            <Label className="">
              <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                <input
                  className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  type="number"
                  value={resultsPerPage}
                  onChange={(e) => setResultPerPage(parseInt(e.target.value))}
                />
                <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                  Results on Table
                </div>
              </div>
            </Label>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <OrdersTable
        orders={orders}
        resultsPerPage={resultsPerPage}
        filter={filter}
        loading={loading}
        onStatusUpdate={handleOrderStatusUpdate}
      />
    </div>
  );
};

export default Orders;
