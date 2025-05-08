import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/src/assets/images/404.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        Trang web không tìm thấy
      </h1>
      <Link
        to="/"
        style={{
          padding: "12px 24px",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "20px",
          transition: "background-color 0.3s ease, transform 0.3s ease", // Thêm hiệu ứng chuyển đổi
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "rgba(255, 255, 255, 0.7)"; // Màu nền khi hover
          e.target.style.transform = "scale(1.1)"; // Phóng to khi hover
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "rgba(0, 0, 0, 0.6)"; // Trả về màu nền ban đầu
          e.target.style.transform = "scale(1)"; // Trả về kích thước ban đầu
        }}
      >
        Quay về Trang Chủ
      </Link>
    </div>
  );
}

export default NotFound;
