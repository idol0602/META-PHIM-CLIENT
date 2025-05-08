import { useState, useContext } from "react";
import loginBg from "../assets/images/login_bg.jpg";
import { LoginContext } from "../global/LoginContext";
import { Link } from "react-router-dom";
import axiosInstance from "../global/axiosInstance";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const { updateCurUser } = useContext(LoginContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axiosInstance.post(
        "/login-local",
        {
          username: name,
          password: pwd,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setSuccess(true);
        setError(null);
        const userId = res.data.user?._id;
        if (userId) {
          navigate(`/user/${userId}`);
        } else {
          alert("Đăng nhập thành công, nhưng không tìm thấy thông tin user.");
        }
      } else {
        setError(res.data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi đăng nhập.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "90vh",
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${loginBg}) center/cover no-repeat`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ToastContainer
        position="top-right" // <-- Vị trí góc trên bên phải
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div
        style={{
          backgroundColor: "rgb(28, 29, 38)",
          padding: 40,
          borderRadius: "7px",
        }}
      >
        <h3
          style={{
            background:
              "linear-gradient(to right, #fff, rgba(235, 200, 113, 0.8))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
          }}
        >
          Đăng nhập
        </h3>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          Nếu bạn chưa có tài khoản,
          <span>
            <Link
              to="/signIn"
              style={{ textDecoration: "none", color: "rgb(235, 200, 113)" }}
            >
              {" đăng ký ngay"}
            </Link>
          </span>
        </p>

        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}
        {success && (
          <div style={{ color: "green", marginBottom: "10px" }}>
            Đăng nhập thành công!
          </div>
        )}

        <div className="mb-3">
          <label
            htmlFor="name"
            className="form-label"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 500,
              marginBottom: "8px",
            }}
          >
            Tên tài khoản
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            style={{
              backgroundColor: "rgb(40, 40, 49)",
              color: "white",
              border: "none",
            }}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="pwd"
            className="form-label"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 500,
              marginBottom: "8px",
            }}
          >
            Mật khẩu
          </label>
          <input
            type="password"
            className="form-control"
            id="pwd"
            name="pwd"
            value={pwd}
            style={{
              backgroundColor: "rgb(40, 40, 49)",
              color: "white",
              border: "none",
            }}
            onChange={(e) => setPwd(e.target.value)}
          />
        </div>

        <button
          className="btn btn-warning-user mb-3"
          style={{
            backgroundColor: "rgb(235, 200, 113)",
            fontWeight: "bold",
            width: "100%",
          }}
          onClick={handleLogin}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}

export default Login;
