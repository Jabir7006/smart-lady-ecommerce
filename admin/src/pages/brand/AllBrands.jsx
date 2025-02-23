import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Card,
  CardBody,
  Label,
  Select,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon, AddIcon, HomeIcon } from "../../icons";
import { useBrands, useDeleteBrand } from "../../hooks/useBrands";
import toast from "react-hot-toast";
import EmptyState from "../../components/EmptyState";
import { NavLink } from "react-router-dom";
import Icon from "../../components/Icon";
import ThemedSuspense from "../../components/ThemedSuspense";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const BrandsAll = () => {
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useBrands({
    page,
    limit: resultsPerPage,
    search,
    sort,
    order,
  });

  const deleteBrand = useDeleteBrand();

  const handleDelete = async () => {
    setIsDeleting(true);
    const loadingToast = toast.loading("Deleting brand...");

    try {
      await deleteBrand.mutateAsync(brandToDelete);
      toast.success("Brand deleted successfully!", { id: loadingToast });
      setIsDeleteModalOpen(false);
      setBrandToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting brand", {
        id: loadingToast,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (p) => {
    setPage(p);
  };

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
  };

  if (isLoading)
    return (
      <div>
        <ThemedSuspense />
      </div>
    );

  return (
    <div>
      <PageTitle>Brands</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Brands</p>
      </div>

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All Brands
              </p>

              <Label className="mx-3">
                <Select className="py-3" onChange={(e) => handleSort("title")}>
                  <option>Sort by</option>
                  <option value="asc">Name (A-Z)</option>
                  <option value="desc">Name (Z-A)</option>
                </Select>
              </Label>

              <Label className="mr-8">
                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                  <input
                    className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Number of Results"
                    value={resultsPerPage}
                    onChange={(e) => setResultsPerPage(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                    Results
                  </div>
                </div>
              </Label>
            </div>
            <Link to="/app/add-brand">
              <Button iconLeft={AddIcon}>Add Brand</Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Title</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data?.brands?.map((brand) => (
              <TableRow key={brand._id}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{brand.title}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex">
                    <Link to={`/app/brand/edit/${brand._id}`}>
                      <Button
                        icon={EditIcon}
                        className="mr-3"
                        layout="outline"
                        aria-label="Edit"
                      />
                    </Link>
                    <Button
                      icon={TrashIcon}
                      layout="outline"
                      onClick={() => {
                        setBrandToDelete(brand._id);
                        setIsDeleteModalOpen(true);
                      }}
                      disabled={isDeleting}
                      aria-label="Delete"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={data?.total || 0}
            resultsPerPage={resultsPerPage}
            onChange={handlePageChange}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>

      {!isLoading && (!data?.brands || data.brands.length === 0) && (
        <EmptyState
          title="No brands found"
          message="Get started by creating your first brand"
          actionLink="/app/add-brand"
          actionText="Add Brand"
        />
      )}

      {/* Delete Confirmation Modal */}
      {/* <Modal isOpen={isDeleteModalOpen} onClose={() => !isDeleting && setIsDeleteModalOpen(false)}>
        <ModalHeader>Delete Brand</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this brand? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <div className="flex space-x-3">
            <Button 
              layout="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={isDeleting}
              className={`${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </ModalFooter>
      </Modal> */}

      <DeleteConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        title="Brand"
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default BrandsAll;
