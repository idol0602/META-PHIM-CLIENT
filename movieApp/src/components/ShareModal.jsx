import React from "react";
import { toast } from "react-toastify";

const ShareModal = ({ link, isOpen, onClose }) => {
  if (!isOpen) return null;

  const encodedLink = encodeURIComponent(link);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Đã sao chép vào bộ nhớ tạm");
    } catch (err) {
      console.log(err);
    }
  };

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
  const zaloShareUrl = `https://zalo.me/share?url=${encodedLink}`;

  const highlightColor = "rgb(235, 200, 113)";
  const modalBackground = "#1e1e1e";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: modalBackground,
          padding: "25px",
          borderRadius: "12px",
          minWidth: "360px",
          color: "#fff",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ color: highlightColor, marginBottom: "15px" }}>
          Chia sẻ bài viết
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", width: "100%" }}
          >
            <button
              style={{
                backgroundColor: highlightColor,
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e1e1e",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "transform 0.3s ease",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              📘 Chia sẻ Facebook
            </button>
          </a>

          <a
            href={zaloShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", width: "100%" }}
          >
            <button
              style={{
                backgroundColor: highlightColor,
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e1e1e",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "transform 0.3s ease",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              💬 Chia sẻ Zalo
            </button>
          </a>

          <button
            onClick={handleCopy}
            style={{
              backgroundColor: highlightColor,
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#1e1e1e",
              fontWeight: "bold",
              fontSize: "16px",
              transition: "transform 0.3s ease",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              width: "100%",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05).")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            🔗 Sao chép liên kết
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            border: `1px solid ${highlightColor}`,
            padding: "8px 16px",
            borderRadius: "6px",
            color: highlightColor,
            cursor: "pointer",
            transition: "background-color 0.3s ease, color 0.3s ease",
            marginTop: "10px",
            width: "100%",
            fontWeight: "bold",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = highlightColor;
            e.target.style.color = "black";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = highlightColor;
          }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
