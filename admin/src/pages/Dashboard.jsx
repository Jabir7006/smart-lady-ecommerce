import React, { useState, useEffect } from "react";

import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import {
  CartIcon,
  MoneyIcon,
  PeopleIcon,
  ChatIcon,
  // TrendingUpIcon,
} from "../icons";
import RoundIcon from "../components/RoundIcon";
import {
  getDashboardStats,
  getSalesAnalytics,
  getRevenueDistribution,
  getCustomerAnalytics,
  getProductAnalytics,
} from "../services/dashboardService";
import { getAllOrders } from "../services/orderService";
import { Card, CardBody, Select } from "@windmill/react-ui";
import OrdersTable from "../components/OrdersTable";

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRevenue: 0,
    newOrders: 0,
    totalOrders: 0,
  });

  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });

  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [],
  });

  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);

  const [productData, setProductData] = useState({
    labels: [],
    datasets: [],
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchProductAnalytics();
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchSalesAnalytics();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, revenueRes, customerRes] = await Promise.all([
        getDashboardStats(),
        getRevenueDistribution(),
        getCustomerAnalytics(),
      ]);

      setStats({
        totalCustomers: statsRes.data.totalCustomers,
        totalRevenue: statsRes.data.totalRevenue,
        newOrders: statsRes.data.newOrders,
        totalOrders: statsRes.data.totalOrders,
      });

      setRevenueData({
        labels: ["COD", "Online Payment", "Wallet"],
        datasets: [
          {
            data: [
              revenueRes.data.codRevenue,
              revenueRes.data.onlineRevenue,
              revenueRes.data.walletRevenue,
            ],
            backgroundColor: ["#0694a2", "#1c64f2", "#7e3af2"],
            label: "Revenue",
          },
        ],
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const fetchSalesAnalytics = async () => {
    try {
      const response = await getSalesAnalytics(period);
      setSalesData({
        labels: response.data.labels,
        datasets: [
          {
            label: "Sales",
            data: response.data.sales,
            fill: false,
            borderColor: "#7e3af2",
            tension: 0.4,
          },
          {
            label: "Orders",
            data: response.data.orders,
            fill: false,
            borderColor: "#0694a2",
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching sales analytics:", error);
    }
  };

  const fetchProductAnalytics = async () => {
    try {
      const response = await getProductAnalytics();
      const products = response.data;

      setProductData({
        labels: products.map((p) => p.name),
        datasets: [
          {
            label: "Units Sold",
            data: products.map((p) => p.totalSold),
            backgroundColor: "#7e3af2",
            borderRadius: 6,
          },
          {
            label: "Revenue (₹)",
            data: products.map((p) => p.totalRevenue),
            backgroundColor: "#0694a2",
            borderRadius: 6,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching product analytics:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await getAllOrders();
      if (response && response.orders) {
        setOrders(response.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const doughnutOptions = {
    data: revenueData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "70%",
      plugins: {
        legend: {
          display: false,
        },
      },
      layout: {
        padding: 20,
      },
    },
  };

  const lineOptions = {
    data: salesData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            borderDash: [2, 4],
            drawBorder: false,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
    },
  };

  const barOptions = {
    data: productData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            borderDash: [2, 4],
            drawBorder: false,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
    },
  };

  if (loading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  return (
    <>
      <PageTitle>Dashboard Overview</PageTitle>

      {/* Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
        >
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          subtitle="This month"
        >
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard
          title="New Orders"
          value={stats.newOrders.toString()}
          subtitle="Last 24 hours"
        >
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          subtitle="All time"
        >
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-purple-500 dark:text-purple-100"
            bgColorClass="bg-purple-100 dark:bg-purple-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      {/* Charts */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Sales Analytics">
          <div className="flex justify-end mb-4">
            <Select
              onChange={(e) => setPeriod(e.target.value)}
              className="w-32"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </Select>
          </div>
          <Line {...lineOptions} />
          <ChartLegend
            legends={[
              { title: "Sales", color: "bg-purple-600" },
              { title: "Orders", color: "bg-teal-600" },
            ]}
          />
        </ChartCard>

        <ChartCard title="Revenue Distribution">
          <Doughnut {...doughnutOptions} />
          <ChartLegend
            legends={[
              { title: "COD", color: "bg-teal-600" },
              { title: "Online", color: "bg-blue-600" },
              { title: "Wallet", color: "bg-purple-600" },
            ]}
          />
        </ChartCard>
      </div>

      {/* Top Selling Products Chart */}
      <Card className="mb-8">
        <CardBody>
          <p className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
            Top Selling Products
          </p>
          <div className="h-[300px]">
            <Bar {...barOptions} />
          </div>
          <ChartLegend
            legends={[
              { title: "Units Sold", color: "bg-purple-600" },
              { title: "Revenue", color: "bg-teal-600" },
            ]}
          />
        </CardBody>
      </Card>

      {/* Recent Orders */}
      <Card className="mb-8">
        <CardBody>
          <p className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
            Recent Orders
          </p>
          <OrdersTable
            orders={orders}
            resultsPerPage={5}
            loading={ordersLoading}
            filter="all"
          />
        </CardBody>
      </Card>
    </>
  );
}

export default Dashboard;
