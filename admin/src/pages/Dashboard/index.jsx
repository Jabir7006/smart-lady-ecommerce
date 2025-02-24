import React, { memo } from "react";
import { useDashboardQueries } from "../../hooks/useDashboardQueries";
import PageTitle from "../../components/Typography/PageTitle";
import ErrorDisplay from "../../components/ErrorDisplay";
import StatsCards from "./components/StatsCards";
import RevenueChart from "./components/RevenueChart";
import SalesChart from "./components/SalesChart";
import CustomerAnalytics from "./components/CustomerAnalytics";
import ProductAnalytics from "./components/ProductAnalytics";
import RecentOrders from "./components/RecentOrders";

// Memoized loading placeholder
const LoadingPlaceholder = memo(({ height }) => (
  <div className={`h-${height} bg-gray-200 rounded-lg animate-pulse`} />
));

function Dashboard() {
  const {
    statsQuery,
    revenueQuery,
    salesQuery,
    customerQuery,
    productQuery,
    ordersQuery,
    isError,
    refetchAll,
  } = useDashboardQueries();

  if (isError) {
    return (
      <ErrorDisplay
        message="Failed to load dashboard data"
        onRetry={refetchAll}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <PageTitle>Dashboard</PageTitle>
        <button
          onClick={refetchAll}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        {!statsQuery.data ? (
          <LoadingPlaceholder height="20" />
        ) : (
          <StatsCards data={statsQuery.data} />
        )}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <div>
          {!revenueQuery.data ? (
            <LoadingPlaceholder height="64" />
          ) : (
            <RevenueChart data={revenueQuery.data} />
          )}
        </div>

        <div>
          {!salesQuery.data ? (
            <LoadingPlaceholder height="64" />
          ) : (
            <SalesChart data={salesQuery.data} />
          )}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <div>
          {!customerQuery.data ? (
            <LoadingPlaceholder height="64" />
          ) : (
            <CustomerAnalytics data={customerQuery.data} />
          )}
        </div>

        <div>
          {!productQuery.data ? (
            <LoadingPlaceholder height="64" />
          ) : (
            <ProductAnalytics data={productQuery.data} />
          )}
        </div>
      </div>

      {/* Orders Section */}
      <div>
        {!ordersQuery.data ? (
          <LoadingPlaceholder height="96" />
        ) : (
          <RecentOrders orders={ordersQuery.data} />
        )}
      </div>
    </>
  );
}

export default memo(Dashboard);
