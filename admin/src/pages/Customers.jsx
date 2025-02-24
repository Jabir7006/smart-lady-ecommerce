import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import ChartCard from "../components/Chart/ChartCard";
import { Line, Bar } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import {
  lineOptions,
  lineLegends,
  realTimeUsersBarLegends,
  realTimeUsersBarOptions,
} from "../utils/demo/chartsData";
import UsersTable from "../components/UsersTable";
import {
  getCustomerGrowth,
  getOnlineUsers,
  getAllUsers,
} from "../services/userService";
import toast from "react-hot-toast";

const Customers = () => {
  const [growthData, setGrowthData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        label: "New Customers",
        fill: true,
        backgroundColor: "rgba(126, 58, 242, 0.1)",
        borderColor: "#7e3af2",
      },
    ],
  });

  const [onlineData, setOnlineData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        label: "Online Users",
        backgroundColor: "#0694a2",
        borderWidth: 1,
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [growthResponse, onlineResponse, usersResponse] = await Promise.all(
        [getCustomerGrowth(), getOnlineUsers(), getAllUsers("user")]
      );

      console.log("Users Response:", usersResponse);

      // Update growth chart data
      if (growthResponse?.data) {
        const data = growthResponse.data;
        setGrowthData({
          labels: data.map((item) => item.date),
          datasets: [
            {
              ...growthData.datasets[0],
              data: data.map((item) => item.count),
            },
          ],
        });
      }

      // Update online users chart data
      if (onlineResponse?.data) {
        const data = onlineResponse.data;
        setOnlineData({
          labels: data.map((item) => item.time),
          datasets: [
            {
              ...onlineData.datasets[0],
              data: data.map((item) => item.count),
            },
          ],
        });
      }

      // Update users table data
      if (usersResponse?.data?.users) {
        setUsers(usersResponse.data.users);
      } else if (usersResponse?.users) {
        setUsers(usersResponse.users);
      } else {
        console.error("Unexpected users response structure:", usersResponse);
        setError("Failed to parse users data");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setError(error.message || "Failed to fetch customer data");
      toast.error(error.message || "Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  // Merge real data with chart options
  const lineOptionsWithData = {
    ...lineOptions,
    data: growthData,
  };

  const barOptionsWithData = {
    ...realTimeUsersBarOptions,
    data: onlineData,
  };

  const renderChart = (ChartComponent, options, legends, title) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64 text-red-500">
          <p>Failed to load chart data</p>
        </div>
      );
    }

    return (
      <>
        <ChartComponent {...options} />
        <ChartLegend legends={legends} />
      </>
    );
  };

  return (
    <div>
      <PageTitle>Manage Customers</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Customer Growth">
          {renderChart(Line, lineOptionsWithData, lineLegends)}
        </ChartCard>

        <ChartCard title="Online Visitors">
          {renderChart(Bar, barOptionsWithData, realTimeUsersBarLegends)}
        </ChartCard>
      </div>

      <UsersTable
        users={users}
        resultsPerPage={10}
        loading={loading}
        error={error}
        onRetry={fetchCustomerData}
      />
    </div>
  );
};

export default Customers;
