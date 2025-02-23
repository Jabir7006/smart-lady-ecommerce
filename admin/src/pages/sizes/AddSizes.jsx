import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import PageTitle from "../../components/Typography/PageTitle";
import {
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Pagination,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon, HomeIcon } from "../../icons";
import {
  useSizes,
  useCreateSize,
  useDeleteSize,
  useUpdateSize,
} from "../../hooks/useSizes";
import toast from "react-hot-toast";
import * as yup from "yup";
import Icon from "../../components/Icon";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import EmptyState from "../../components/EmptyState";

const sizeSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

const AddSizes = () => {
  const [sizeData, setSizeData] = useState({
    title: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Table state
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState(null);

  // Hooks
  const { data, isLoading } = useSizes({
    page,
    limit: resultsPerPage,
    search,
    sort,
    order,
  });
  const createSize = useCreateSize();
  const updateSize = useUpdateSize();
  const deleteSize = useDeleteSize();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(
      editingId ? "Updating size..." : "Creating size..."
    );

    try {
      await sizeSchema.validate(sizeData, { abortEarly: false });

      if (editingId) {
        await updateSize.mutateAsync({
          id: editingId,
          title: sizeData.title,
        });
        toast.success("Size updated successfully!", { id: loadingToast });
      } else {
        await createSize.mutateAsync(sizeData);
        toast.success("Size created successfully!", { id: loadingToast });
      }

      setSizeData({ title: "" }); // Reset form
      setEditingId(null); // Reset editing state
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
      toast.error(error.response?.data?.message || "Error creating size", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting size...");
    try {
      await deleteSize.mutateAsync(sizeToDelete);
      toast.success("Size deleted successfully!", { id: loadingToast });
      setIsDeleteModalOpen(false);
      setSizeToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting size", {
        id: loadingToast,
      });
    }
  };

  const handleEdit = (size) => {
    setSizeData({ title: size.title });
    setEditingId(size._id);
  };

  const handlePageChange = (p) => {
    setPage(p);
  };

  return (
    <div>
      <PageTitle>Sizes</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Sizes</p>
      </div>

      {/* Add Size Form */}
      <Card className="mt-8">
        <CardBody>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Label className="flex-1">
              <Input
                className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
                placeholder="Enter size title"
                name="title"
                value={sizeData.title}
                onChange={(e) =>
                  setSizeData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              {errors.title && (
                <span className="text-xs text-red-500">{errors.title}</span>
              )}
            </Label>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                ? "Update Size"
                : "Create Size"}
            </Button>
            {editingId && (
              <Button
                layout="outline"
                onClick={() => {
                  setSizeData({ title: "" });
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            )}
          </form>
        </CardBody>
      </Card>

      {/* Sizes List */}
      <TableContainer className="mb-8 mt-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Title</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data?.data?.map((size) => (
              <TableRow key={size._id}>
                <TableCell>
                  <span className="font-semibold">{size.title}</span>
                </TableCell>
                <TableCell>
                  <div className="flex">
                    <Button
                      icon={EditIcon}
                      layout="outline"
                      onClick={() => handleEdit(size)}
                      aria-label="Edit"
                      className="mr-2"
                    />
                    <Button
                      icon={TrashIcon}
                      layout="outline"
                      onClick={() => {
                        setSizeToDelete(size._id);
                        setIsDeleteModalOpen(true);
                      }}
                      aria-label="Delete"
                      className="mr-2"
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

      {!isLoading && (!data?.data || data.data.length === 0) && (
        <EmptyState
          title="No sizes found"
          message="Get started by creating your first size"
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDelete={handleDelete}
        title="Size"
      />
    </div>
  );
};

export default AddSizes;
