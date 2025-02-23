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
  Badge,
  Button,
  Pagination,
  Card,
  CardBody,
  Label,
  Select,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon, AddIcon, HomeIcon } from "../../icons";
import {
  useSubCategories,
  useDeleteSubCategory,
} from "../../hooks/useSubCategories";
import toast from "react-hot-toast";
import EmptyState from "../../components/EmptyState";
import { NavLink } from "react-router-dom";
import Icon from "../../components/Icon";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const SubCategoriesAll = () => {
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useSubCategories({
    page,
    limit: resultsPerPage,
    search,
    sort,
    order,
  });

  const deleteSubCategory = useDeleteSubCategory();

  const handleDelete = async () => {
    setIsDeleting(true);
    const loadingToast = toast.loading("Deleting subcategory...");

    try {
      await deleteSubCategory.mutateAsync(subCategoryToDelete);
      toast.success("Subcategory deleted successfully!", { id: loadingToast });
      setIsDeleteModalOpen(false);
      setSubCategoryToDelete(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deleting subcategory",
        { id: loadingToast }
      );
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <PageTitle>Sub Categories</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Sub Categories</p>
      </div>

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All Sub Categories
              </p>

              <Label className="mx-3">
                <Select className="py-3" onChange={(e) => handleSort("name")}>
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
            <Link to="/app/add-sub-category">
              <Button iconLeft={AddIcon}>Add Sub Category</Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Parent Category</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data?.subCategories?.map((subCategory) => (
              <TableRow key={subCategory._id}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{subCategory.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge type="success">{subCategory.category?.name}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex">
                    <Link to={`/app/subcategory/edit/${subCategory._id}`}>
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
                        setSubCategoryToDelete(subCategory._id);
                        setIsDeleteModalOpen(true);
                      }}
                      disabled={isDeleting}
                      className={`${
                        isDeleting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
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

      {!isLoading &&
        (!data?.subCategories || data.subCategories.length === 0) && (
          <EmptyState
            title="No sub categories found"
            message="Get started by creating your first sub category"
            actionLink="/app/add-subcategory"
            actionText="Add Sub Category"
          />
        )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        title="Sub Category"
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default SubCategoriesAll;
