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
    processingOrders: 0,
    shippedOrders: 0,
    cancelledOrders: 0,
    todayOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
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
      <PageTitle>Orders Management</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300 mb-6">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Orders</p>
      </div>

      {/* Order Summary Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {/* Today's Overview */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardBody className="flex items-center">
            <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
              <Icon className="w-5 h-5" aria-hidden="true" icon={CartIcon} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Today's Orders
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {stats.todayOrders}
              </p>
              <p className="text-sm text-blue-500">
                ₹{stats.todayRevenue.toLocaleString()} revenue today
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Order Status Overview */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardBody className="flex items-center">
            <div className="p-3 mr-4 text-yellow-500 bg-yellow-100 rounded-full dark:text-yellow-100 dark:bg-yellow-500">
              <Icon className="w-5 h-5" aria-hidden="true" icon={PeopleIcon} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Orders in Progress
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {stats.processingOrders + stats.shippedOrders}
              </p>
              <div className="text-xs space-x-2">
                <span className="text-orange-500">
                  {stats.processingOrders} processing
                </span>
                <span className="text-blue-500">
                  {stats.shippedOrders} shipped
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Monthly Performance */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardBody className="flex items-center">
            <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
              <Icon className="w-5 h-5" aria-hidden="true" icon={MoneyIcon} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Revenue
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                ৳{stats.monthlyRevenue.toLocaleString()} TK
              </p>
              <p className="text-sm text-green-500">
                {stats.completedOrders} completed orders
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Order Success Rate */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardBody className="flex items-center">
            <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full dark:text-purple-100 dark:bg-purple-500">
              <Icon className="w-5 h-5" aria-hidden="true" icon={CartIcon} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Order Success Rate
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {stats.totalOrders
                  ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(
                      1
                    ) + "%"
                  : "0%"}
              </p>
              <p className="text-sm text-red-500">
                {stats.cancelledOrders} cancelled
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filter Section with Enhanced UI */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Filter Orders
              </p>
              <Select
                className="py-3 min-w-[150px]"
                onChange={(e) => handleFilter(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Show
              </p>
              <Select
                className="py-3 w-[100px]"
                value={resultsPerPage}
                onChange={(e) => setResultPerPage(parseInt(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Select>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                entries
              </p>
            </div>
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
