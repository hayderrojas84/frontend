import React from "react";
import ReactDOM from "react-dom";


const Modal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">
          Cerrar
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
