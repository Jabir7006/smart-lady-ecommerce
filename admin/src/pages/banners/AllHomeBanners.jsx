import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
  Button,
} from "@windmill/react-ui";
import { useHomeBanners } from "../../hooks/useHomeBanners";
import { EditIcon, TrashIcon } from "../../icons";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useDeleteHomeBanner } from "../../hooks/useHomeBanners";
import { useState } from "react";
const AllHomeBanners = () => {
  const { data, isLoading } = useHomeBanners();
  const { mutate: deleteHomeBanner } = useDeleteHomeBanner();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const handleDelete = () => {
    deleteHomeBanner(bannerToDelete);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <TableContainer className="mb-8 mt-8 p-8">
      <Table>
        <TableHeader>
          <tr>
            <TableCell>Banner Image</TableCell>
            <TableCell>Alt Text</TableCell>
            <TableCell>Actions</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {data?.banners?.map((banner) => (
            console.log(banner),
            <TableRow key={banner._id}>
              <TableCell>
                <td
                  style={{
                    boxSizing: "border-box",
                    margin: "0px",
                    borderTop: "1px solid rgb(222, 226, 230)",
                    padding: "0.75rem",
                    fontWeight: 500,
                    fontSize: "14px",
                    verticalAlign: "middle",
                    color: "rgba(255, 255, 255, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderCollapse: "collapse",
                    borderSpacing: "2px 2px",
                  }}
                >
                  <div
                    className="d-flex align-items-center"
                    style={{
                      boxSizing: "border-box",
                      margin: "0px",
                      padding: "0px",
                      width: "200px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="imgWrapper h-auto"
                      style={{
                        boxSizing: "border-box",
                        margin: "0px",
                        padding: "0px",
                        flex: "0 0 200px",
                        width: "200px",
                        height: "auto",
                      }}
                    >
                      <div
                        className="img card shadow m-0 h-auto"
                        style={{
                          boxSizing: "border-box",
                          padding: "0px",
                          overflowWrap: "break-word",
                          display: "flex",
                          flexDirection: "column",
                          minWidth: "0px",
                          position: "relative",
                          boxShadow: "rgba(0, 0, 0, 0.15) 0px 0.5rem 1rem",
                          height: "auto",
                          margin: "0px",
                          background: "rgb(27, 43, 77)",
                          border: "1px solid rgb(16, 33, 75)",
                          backgroundClip: "initial",
                          backgroundColor: "rgb(27, 43, 77)",
                          borderRadius: "5px",
                          overflow: "hidden",
                        }}
                      >
                        <span
                          className="lazy-load-image-background blur lazy-load-image-loaded"
                          style={{
                            boxSizing: "border-box",
                            margin: "0px",
                            padding: "0px",
                            transition: "filter 0.3s",
                            filter: "blur(0px)",
                            color: "transparent",
                            display: "inline-block",
                          }}
                        >
                          <img
                            className="w-100"
                            alt={banner.alt}
                            src={banner.image.url}
                            style={{
                              boxSizing: "border-box",
                              margin: "0px",
                              padding: "0px",
                              borderStyle: "none",
                              verticalAlign: "middle",
                              transition: "opacity 0.3s",
                              opacity: 1,
                              width: "100%",
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
              </TableCell>
              <TableCell>
                <span>{banner?.image?.alt || "No alt text"}</span>
              </TableCell>
              <TableCell>
                <div className="flex">
                  <Button
                    icon={EditIcon}
                    layout="outline"
                    // onClick={() => handleEdit(banner)}
                    aria-label="Edit"
                    className="mr-2"
                  />
                  <Button
                    icon={TrashIcon}
                    layout="outline"
                    onClick={() => {
                      setBannerToDelete(banner._id);
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
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDelete={handleDelete}
        title="Banner"
      />
    </TableContainer>
  );
};

export default AllHomeBanners;
