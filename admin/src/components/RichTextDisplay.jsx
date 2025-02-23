import React from "react";
import DOMPurify from "dompurify";
import "../styles/quill.css";

const RichTextDisplay = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: [
      "iframe",
      "h1",
      "h2",
      "h3",
      "h4",
      "p",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "blockquote",
    ],
    ADD_ATTR: ["class", "style"],
  });

  return (
    <div
      className="formatted-content"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default RichTextDisplay;
