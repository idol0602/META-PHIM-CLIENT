import { useContext, useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import ScrollTopButton from "../components/ScrollTopButton";
import logo from "../assets/images/logo.png";
import { LoginContext } from "../global/LoginContext";
function Container() {
  const { user, updateCurUser } = useContext(LoginContext);
  const [hasOpacity, setHasOpacity] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const navRef = useRef();

  const closeDropDown = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    updateCurUser();
    const handleScroll = () => {
      setHasOpacity(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <nav
        ref={navRef}
        className="navbar bg-dark navbar-dark"
        style={{
          position: "fixed",
          zIndex: 1000,
          width: "100%",
          top: 0,
          padding: 10,
          opacity: hasOpacity ? 0.6 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <div className="container-fluid d-flex align-items-center">
          <div className="d-flex">
            <button
              className="menu-btn"
              onClick={() => setShowMenu(!showMenu)}
              style={{ marginRight: 10 }}
            >
              ☰
            </button>
            <Link
              to="/"
              className="navbar-brand"
              onClick={() => {
                closeDropDown();
              }}
            >
              <img src={logo} alt="Logo" style={{ width: 100, height: 60 }} />
            </Link>
          </div>
          <ul
            className={`navbar-menu ${showMenu ? "show" : ""}`}
            style={{
              marginTop: showMenu ? 20 : 0,
              marginBottom: 0,
              fontSize: 20,
              fontWeight: "bold",
              overflowY: showMenu ? "auto" : "unset",
            }}
          >
            <li
              className={`nav-item ${
                location.pathname === "/list/find_movies" ? "active" : ""
              }`}
              onClick={() => {
                closeDropDown();
              }}
            >
              <Link to="/list/find_movies" className="nav-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  style={{ fill: "white" }}
                >
                  <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                </svg>
                Tìm kiếm
              </Link>
            </li>
            <li
              className={`nav-item ${
                location.pathname === "/list/top_movies" ? "active" : ""
              }`}
              onClick={() => {
                closeDropDown();
              }}
            >
              <Link to="/list/top_movies" className="nav-link">
                Phim hot
              </Link>
            </li>
            <li
              className={`nav-item ${
                location.pathname === "/list/phim-bo" ? "active" : ""
              }`}
              onClick={() => {
                closeDropDown();
              }}
            >
              <Link to="/list/phim-bo" className="nav-link">
                Phim bộ
              </Link>
            </li>
            <li
              className={`nav-item ${
                location.pathname === "/list/phim-le" ? "active" : ""
              }`}
              onClick={() => {
                closeDropDown();
              }}
            >
              <Link to="/list/phim-le" className="nav-link">
                Phim lẻ
              </Link>
            </li>
            <li
              className={`nav-item ${
                location.pathname === "/list/phim-moi" ? "active" : ""
              }`}
              onClick={() => {
                closeDropDown();
              }}
            >
              <Link to="/list/phim-moi" className="nav-link">
                Phim mới
              </Link>
            </li>
            <li
              className={`nav-item ${
                location.pathname === "/about_us" ? "active" : ""
              }`}
              onClick={() => {
                closeDropDown();
              }}
            >
              <Link to="/about_us" className="nav-link">
                Giới thiệu
              </Link>
            </li>
            {user && user.role == "admin" ? (
              <li
                className={`nav-item ${
                  location.pathname === "/dashboard" ? "active" : ""
                }`}
                onClick={() => {
                  closeDropDown();
                }}
              >
                <Link to="/dashboard" className="nav-link">
                  Admin dashboard
                </Link>
              </li>
            ) : (
              <li></li>
            )}
          </ul>
          {user && user.username ? (
            <Link
              to={`/user/${user.accout_ID ? user.accout_ID : user._id}`}
              className="nav-link"
            >
              <div
                className="rounded-circle"
                style={{
                  width: "50px",
                  height: "50px",
                  overflow: "hidden",
                  border: "2px solid rgb(235, 200, 113)",
                  cursor: "pointer",
                }}
              >
                <img
                  src={user.avt}
                  alt="Avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Link>
          ) : (
            <div className="login-btn">
              <Link to="/login" className="nav-link">
                <button className="btn btn-warning-user">Đăng nhập</button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div style={{ flex: 1, padding: "90px 0px 10px 0px" }}>
        <ScrollTopButton></ScrollTopButton>
        <Outlet />
      </div>
      <footer
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          centerMode: true,
          backgroundColor: "rgb(52, 58, 64)",
          color: "white",
          textAlign: "center",
        }}
      >
        <p style={{ color: "rgb(255, 235, 185)" }}>
          Contact for work, copyright and more:
        </p>
        <p>Nguyenquan06022004@gmail.com</p>
        <p>
          <a style={{ color: "white", textDecoration: "none" }} href="#">
            Điều khoản dịch vụ
          </a>
        </p>
        <p>
          <a style={{ color: "white", textDecoration: "none" }} href="#">
            Chính sách bảo mật
          </a>
        </p>
        <p style={{ color: "grey" }}>© 2025 - meta-film.onrender.com</p>
      </footer>
    </div>
  );
}

export default Container;
