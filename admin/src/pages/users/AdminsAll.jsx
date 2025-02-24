import React, { useState, useEffect } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
} from "@windmill/react-ui";
import { HomeIcon, EditIcon } from "../../icons";
import { getAllUsers } from "../../services/userService";
import toast from "react-hot-toast";

const AdminsAll = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageTable, setPageTable] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers("admin");
      // Filter only admin users
      const adminUsers = response.users.filter((user) => user.role === "admin");
      setAdmins(adminUsers);
      setTotalResults(adminUsers.length);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const onPageChange = (p) => {
    setPageTable(p);
  };

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (pageTable - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return admins.slice(startIndex, endIndex);
  };

  return (
    <div className="container px-6 mx-auto grid">
      <div className="flex justify-between items-center">
        <PageTitle>Admin Management</PageTitle>
        <NavLink
          to="/app/add-admin"
          className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
        >
          Add New Admin
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
        <p className="mx-2">Admins</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{admin.fullName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{admin.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge type="success">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button layout="link" size="small">
                        <EditIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={onPageChange}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      )}
    </div>
  );
};

export default AdminsAll;
