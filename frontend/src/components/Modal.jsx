import '../styles/Modal.css';

function Modal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
