import React, { useState, useEffect } from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Badge,
  Pagination,
  Button,
  Select,
} from "@windmill/react-ui";
import { updateOrderStatus } from "../services/orderService";
import toast from "react-hot-toast";

const OrdersTable = ({
  orders,
  resultsPerPage,
  filter,
  loading,
  onStatusUpdate,
}) => {
  const [page, setPage] = useState(1);
  const [displayData, setDisplayData] = useState([]);

  // pagination setup
  const totalResults = orders.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const getStatusBadgeType = (status) => {
    switch (status.toLowerCase()) {
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

  const isOrderEditable = (status) => {
    return !["delivered", "cancelled"].includes(status.toLowerCase());
  };

  // Filter and paginate data
  useEffect(() => {
    let filteredData = orders;

    if (filter !== "all") {
      filteredData = orders.filter(
        (order) => order.status.toLowerCase() === filter
      );
    }

    setDisplayData(
      filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  }, [orders, page, resultsPerPage, filter]);

  if (loading) {
    return <div className="text-center">Loading orders...</div>;
  }

  return (
    <div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {displayData.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <span className="text-sm">#{order._id.slice(-6)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{order.user.fullName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {order.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {order.orderItems.length} items
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">₹{order.totalPrice}</span>
                </TableCell>
                <TableCell>
                  <Badge type={getStatusBadgeType(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  {isOrderEditable(order.status) ? (
                    <Select
                      className="mt-1"
                      onChange={(e) =>
                        onStatusUpdate(order._id, e.target.value)
                      }
                      value={order.status}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </Select>
                  ) : (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      No actions available
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default OrdersTable;
