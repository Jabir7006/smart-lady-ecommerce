// Quill Editor Formats and Modules
export const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
  "color",
  "background",
];

export const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
  history: {
    delay: 2000,
    maxStack: 500,
    userOnly: true,
  },
};

// Select styles
export const SELECT_STYLES = {
  control: (provided, { isFocused, isDisabled }) => ({
    ...provided,
    backgroundColor: "#1a1c23",
    borderColor: "#4c4f52",
    borderRadius: "0.5rem",
    minHeight: "38px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#6b7280",
    },
    opacity: isDisabled ? 0.5 : 1,
  }),
  // ... rest of the styles
};
