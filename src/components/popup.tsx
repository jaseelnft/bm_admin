import { useEffect } from "react";
import ReactDOM from "react-dom";

export default function AppPopup({ on, onClose, children }: any) {
  if (!on) return null;
  return (
    <PopUpBody onClose={onClose}>
      <style>{`
    .pp-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-in-out;
    }
        
    .pp-popup {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 300px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.3s ease-in-out;
      position: relative;
    }
        
    button.pp-closeBtn {
      width: 32px;
      height: 32px;
      position: absolute;
      top: 10px;
      right: 10px;
      border: none;
      background: none;
      font-size: 18px;
      cursor: pointer;
      color: rgb(62, 62, 62);
      padding: 0;
      box-shadow: none;
    }
        
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
        
    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }`}</style>
      {children}
    </PopUpBody>
  );
}

function PopUpBody({ onClose, children }: any) {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="pp-overlay" onClick={onClose}>
      <div className="pp-popup" onClick={(e) => e.stopPropagation()}>
        <button className="pp-closeBtn" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
