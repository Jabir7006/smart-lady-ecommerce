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
  useColors,
  useCreateColor,
  useDeleteColor,
  useUpdateColor,
} from "../../hooks/useColors";
import toast from "react-hot-toast";
import * as yup from "yup";
import Icon from "../../components/Icon";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import EmptyState from "../../components/EmptyState";

const colorSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

const AddColor = () => {
  const [colorData, setColorData] = useState({
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState(null);
  const [colorToEdit, setColorToEdit] = useState(null);

  // Hooks
  const { data, isLoading } = useColors({
    page,
    limit: resultsPerPage,
    search,
    sort,
    order,
  });
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();
  const deleteColor = useDeleteColor();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(
      editingId ? "Updating color..." : "Creating color..."
    );

    try {
      await colorSchema.validate(colorData, { abortEarly: false });

      if (editingId) {
        await updateColor.mutateAsync({
          id: editingId,
          title: colorData.title,
        });
        toast.success("Color updated successfully!", { id: loadingToast });
      } else {
        await createColor.mutateAsync(colorData);
        toast.success("Color created successfully!", { id: loadingToast });
      }

      setColorData({ title: "" }); // Reset form
      setEditingId(null); // Reset editing state
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
      toast.error(error.response?.data?.message || "Error creating color", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting color...");
    try {
      await deleteColor.mutateAsync(colorToDelete);
      toast.success("Color deleted successfully!", { id: loadingToast });
      setIsDeleteModalOpen(false);
      setColorToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting color", {
        id: loadingToast,
      });
    }
  };

  const handleEdit = (color) => {
    setColorData({ title: color.title });
    setEditingId(color._id);
  };

  const handlePageChange = (p) => {
    setPage(p);
  };

  return (
    <div>
      <PageTitle>Colors</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Colors</p>
      </div>

      {/* Add Color Form */}
      <Card className="mt-8">
        <CardBody>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Label className="flex-1">
              <Input
                className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
                placeholder="Enter color title"
                name="title"
                value={colorData.title}
                onChange={(e) =>
                  setColorData((prev) => ({ ...prev, title: e.target.value }))
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
                ? "Update Color"
                : "Create Color"}
            </Button>
            {editingId && (
              <Button
                layout="outline"
                onClick={() => {
                  setColorData({ title: "" });
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            )}
          </form>
        </CardBody>
      </Card>

      {/* Colors List */}
      <TableContainer className="mb-8 mt-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Title</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data?.data?.map((color) => (
              <TableRow key={color._id}>
                <TableCell>
                  <span className="font-semibold">{color.title}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.title }}
                    ></div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex">
                    <Button
                      icon={EditIcon}
                      layout="outline"
                      onClick={() => handleEdit(color)}
                      aria-label="Edit"
                      className="mr-2"
                    />
                    <Button
                      icon={TrashIcon}
                      layout="outline"
                      onClick={() => {
                        setColorToDelete(color._id);
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
          title="No colors found"
          message="Get started by creating your first color"
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDelete={handleDelete}
        title="Color"
      />
    </div>
  );
};

export default AddColor;
