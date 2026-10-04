import Modal from "./Modal";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onClose, busy }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-ivory-200">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn-primary" disabled={busy} onClick={onConfirm}>{busy ? "Please wait…" : confirmLabel}</button>
      </div>
    </Modal>
  );
}
