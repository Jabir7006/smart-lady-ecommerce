import React, { useState, useEffect } from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from "@windmill/react-ui";

const UsersTable = ({
  users = [],
  resultsPerPage = 10,
  loading = false,
  error = null,
  onRetry,
}) => {
  const [page, setPage] = useState(1);
  const [displayData, setDisplayData] = useState([]);

  // pagination setup
  const totalResults = users.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  useEffect(() => {
    setDisplayData(
      users.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  }, [page, resultsPerPage, users]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="text-center p-6 text-gray-600 dark:text-gray-400">
        No users found
      </div>
    );
  }

  return (
    <div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined on</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {displayData.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={
                        user.avatar ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(user.fullName)
                      }
                      alt="User avatar"
                    />
                    <div>
                      <p className="font-semibold">{user.fullName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.email}</span>
                </TableCell>
                <TableCell>
                  <Badge type={user.isActive ? "success" : "warning"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
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

export default UsersTable;
