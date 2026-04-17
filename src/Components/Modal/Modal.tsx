import { createPortal } from "react-dom";
import { type ReactNode, useEffect } from "react";
import styles from "./Modal.module.css";
import { Button } from "../../UI/Button/Button";
import { FiX } from "react-icons/fi";

interface ModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  rotation?: "vertical" | "horizontal"; // новый необязательный проп
}

const modalRoot = document.querySelector("#modal-root") as HTMLElement;

const Modal = ({
  isOpen,
  onClose,
  children,
  rotation = "vertical", // по умолчанию вертикально
}: ModalPortalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("keydown", onEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{
          flexDirection: rotation === "horizontal" ? "row" : "column",
        }}
      >
        <Button
          variant="link"
          type="button"
          onClick={() => onClose()}
          style={{ position: "absolute", top: 0, right: 10, width: 16 }}
        >
          <FiX size={20} />
        </Button>
        {children}
      </div>
    </div>,
    modalRoot,
  );
};

export default Modal;
