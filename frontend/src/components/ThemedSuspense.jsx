import React from "react";
import "../assets/css/loadingSpinner.css";

function ThemedSuspense({fullHeight = true}) {

  return (
    <div className={`container-fluid ${fullHeight ? 'vh-100' : ''} d-flex justify-content-center align-items-center p-4 text-secondary`}>
      <div className={`lds-ripple`}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default ThemedSuspense;
