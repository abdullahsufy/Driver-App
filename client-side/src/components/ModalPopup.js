import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalPopup({ showModal, setShowModal,closeBtn = true, title, children }) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton={closeBtn} className={`${children ? "" : "border-0"} border-0`}>
        <Modal.Title className="fs-3 ">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}
