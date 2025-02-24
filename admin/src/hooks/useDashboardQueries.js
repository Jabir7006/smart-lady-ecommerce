import { useQueries } from "@tanstack/react-query";
import {
  getStats,
  getRevenueDistribution,
  getSalesAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
} from "../services/dashboardService";
import { getOrders } from "../services/orderService";

const QUERY_CONFIG = {
  stats: {
    queryKey: ["stats"],
    queryFn: getStats,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  },
  revenue: {
    queryKey: ["revenue-distribution"],
    queryFn: getRevenueDistribution,
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  },
  sales: {
    queryKey: ["sales-analytics", "week"],
    queryFn: () => getSalesAnalytics("week"),
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  },
  customers: {
    queryKey: ["customer-analytics"],
    queryFn: getCustomerAnalytics,
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  },
  products: {
    queryKey: ["product-analytics"],
    queryFn: getProductAnalytics,
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  },
  orders: {
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  },
};

export const useDashboardQueries = () => {
  const queries = useQueries({
    queries: Object.values(QUERY_CONFIG).map((config) => ({
      ...config,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      gcTime: config.cacheTime,
    })),
  });

  const [
    statsQuery,
    revenueQuery,
    salesQuery,
    customerQuery,
    productQuery,
    ordersQuery,
  ] = queries;

  return {
    statsQuery,
    revenueQuery,
    salesQuery,
    customerQuery,
    productQuery,
    ordersQuery,
    isLoading: queries.some((query) => query.isLoading && !query.isFetched),
    isError: queries.some((query) => query.isError),
    refetchAll: () => {
      queries.forEach((query) => {
        if (!query.isFetching) {
          query.refetch();
        }
      });
    },
  };
};
