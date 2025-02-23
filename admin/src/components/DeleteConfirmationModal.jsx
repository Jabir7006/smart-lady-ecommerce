import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";

const DeleteConfirmationModal = ({
  isDeleteModalOpen,
  isDeleting,
  setIsDeleteModalOpen,
  title,
  handleDelete,
}) => {
  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
    >
      <ModalHeader>Delete {title}</ModalHeader>
      <ModalBody>
        Are you sure you want to delete this {title}? This action cannot be
        undone.
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
            className={`${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isDeleting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteConfirmationModal;
