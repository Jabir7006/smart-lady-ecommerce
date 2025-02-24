import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody, Badge, Button } from "@windmill/react-ui";
import { getOrderDetails, updateOrderStatus } from "../services/orderService";
import { TruckIcon, HomeIcon } from "../icons";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import Timeline from "../components/Timeline/Timeline";
import TimelineItem from "../components/Timeline/TimelineItem";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await getOrderDetails(id);
      if (response.success && response.order) {
        setOrder(response.order);
      } else {
        toast.error(response.message || "Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch order details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      await fetchOrderDetails();
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const getStatusBadgeType = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "processing":
        return "primary";
      case "shipped":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "neutral";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Order not found
        </h2>
      </div>
    );
  }

  return (
    <div className="container px-6 mx-auto grid">
      <div className="flex justify-between items-center">
        <PageTitle>Order Details</PageTitle>
        <NavLink
          to="/app/orders"
          className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
        >
          Back to Orders
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
        <NavLink to="/app/orders" className="mx-2">
          Orders
        </NavLink>
        {">"}
        <p className="mx-2">Order Details</p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Order Information */}
        <Card className="min-w-0">
          <CardBody>
            <h2 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
              Order Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Order ID
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  #{order._id?.slice(-6)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </p>
                <Badge type={getStatusBadgeType(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Amount
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  ৳{order.totalPrice?.toLocaleString()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Customer Information */}
        <Card className="min-w-0">
          <CardBody>
            <h2 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
              Customer Information
            </h2>
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {order.user?.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {order.user?.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {order.shippingAddress?.phone || "N/A"}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Shipping Information */}
        <Card className="min-w-0">
          <CardBody>
            <h2 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
              Shipping Information
            </h2>
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Address
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {order.shippingAddress?.street}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Area & City
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {order.shippingAddress?.area}, {order.shippingAddress?.city}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Division & Postal Code
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {order.shippingAddress?.division},{" "}
                  {order.shippingAddress?.postCode}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Order Tracking */}
        <Card className="min-w-0">
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">
                Order Tracking
              </h2>
              {!["delivered", "cancelled"].includes(
                order.status?.toLowerCase()
              ) && (
                <div className="flex gap-2">
                  <Button
                    size="small"
                    onClick={() => handleStatusUpdate("Processing")}
                  >
                    Mark Processing
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleStatusUpdate("Shipped")}
                  >
                    Mark Shipped
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleStatusUpdate("Delivered")}
                  >
                    Mark Delivered
                  </Button>
                </div>
              )}
            </div>

            <Timeline>
              <TimelineItem
                icon={TruckIcon}
                date={new Date(order.createdAt).toLocaleDateString()}
              >
                Order Placed
              </TimelineItem>

              {order.status !== "Pending" && (
                <TimelineItem
                  icon={TruckIcon}
                  date={order.processingDate || "Processing"}
                >
                  Order Processing
                </TimelineItem>
              )}

              {["Shipped", "Delivered"].includes(order.status) && (
                <TimelineItem
                  icon={TruckIcon}
                  date={order.shippedDate || "In Transit"}
                >
                  Order Shipped
                </TimelineItem>
              )}

              {order.status === "Delivered" && (
                <TimelineItem
                  icon={TruckIcon}
                  date={order.deliveredDate || "Delivered"}
                >
                  Order Delivered
                </TimelineItem>
              )}
            </Timeline>
          </CardBody>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="mb-8">
        <CardBody>
          <h2 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
            Order Items
          </h2>
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                  {order.orderItems?.map((item) => (
                    <tr
                      key={item._id}
                      className="text-gray-700 dark:text-gray-400"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          <div className="relative hidden w-12 h-12 mr-3 rounded md:block">
                            <img
                              className="object-cover w-full h-full rounded"
                              src={
                                item.product?.images[0]?.url ||
                                "/placeholder.png"
                              }
                              alt={item.product?.title}
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-200">
                              {item.product?.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {item.color} - {item.size}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        ৳{item.price?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        ৳{(item.price * item.quantity)?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
