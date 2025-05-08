import API from "../api/index";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "../global/LoginContext";
import axiosInstance from "../global/axiosInstance";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Image,
  ProgressBar,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Heart,
  Plus,
  RotateCcw,
  User,
  LogOut,
  Play,
  X,
  Info,
} from "lucide-react";
import "../assets/css/userProfile.css";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCurUser } = useContext(LoginContext);
  const [userName, setUserName] = useState("");
  const [userForUpdate, setUserForUpdate] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [hoveredAvatar, setHoveredAvatar] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState("/avatar/01.jpg");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState([]);

  const avatarList = [
    "/avatar/01.jpg",
    "/avatar/02.jpg",
    "/avatar/03.jpg",
    "/avatar/04.jpg",
    "/avatar/05.jpg",
    "/avatar/06.jpg",
    "/avatar/07.jpg",
    "/avatar/08.jpg",
    "/avatar/09.jpg",
    "/avatar/10.jpg",
    "/avatar/11.jpg",
    "/avatar/12.jpg",
    "/avatar/13.jpg",
  ];

  const handleUpdateUser = async (userData) => {
    try {
      const response = await axiosInstance.post("/update-user", userData, {
        withCredentials: true, // để gửi cookie nếu bạn dùng session
      });
      if (response.data.success) {
        console.log("Cập nhật thành công:", response.data.user);
      } else {
        console.warn("Không thể cập nhật:", response.data.message);
      }
      fetchData();
      updateCurUser();
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
    }
  };

  const handleAvatarSelect = (avatarPath) => {
    setUserForUpdate({ ...userForUpdate, avt: avatarPath });
    setSelectedAvatar(avatarPath);
  };

  const handleAvatarSave = () => {
    handleUpdateUser(userForUpdate);
    toast.success("Ảnh đại diện đã được cập nhật!");
    setShowAvatarModal(false);
  };

  const handleUpdateProfile = () => {
    handleUpdateUser(userForUpdate);
    toast.success("Cập nhật thành công");
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    } else if (oldPassword != user.password) {
      toast.error("Mật khẩu cũ của bạn không khớp");
      return;
    }
    handleUpdateUser(userForUpdate);
    handleCloseModal();
    toast.success("Đổi mật khẩu thành công!");
  };

  async function getLinkFirstVideo(movie) {
    const eps = await API.getEps(movie.slug);
    const link = `/watch/${movie.slug}?server=${
      eps[0].server_name.split("#")[1]
    }&ep=${eps[0].server_data[0].name}`;
    return link;
  }

  const handleLoveFilm = async (movie) => {
    if (!movie) return;

    const obj = {
      category:
        movie.category?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      chap: movie.chap || "",
      imdb: movie.imdb || "",
      tmdb: {
        type: movie.tmdb?.type || "",
        id: movie.tmdb?.id || "",
        season: movie.tmdb?.season || null,
        vote_average: movie.tmdb?.vote_average || 0,
        vote_count: movie.tmdb?.vote_count || 0,
      },
      img: movie.img || "",
      lang: movie.lang || "",
      name: movie.name || "",
      originName: movie.originName || "",
      poster_url: movie.poster_url || "",
      quality: movie.quality || "",
      slug: movie.slug || "",
      time: movie.time || "",
      year: movie.year || new Date().getFullYear(),
    };

    try {
      const res = await axiosInstance.post("/handleLoveFilm", obj, {
        withCredentials: true,
      });
      if (res.data.message == "Đã bỏ thích") {
        toast.info("Đã bỏ thích");
      } else if (
        res.data.message == "Thêm vào danh sách yêu thích thành công"
      ) {
        toast.success("Đã thêm phim vào danh sách yêu thích");
      }
    } catch (error) {
      console.log("Lỗi khi thêm phim:", error);
      if (error.response.data.message == "Chưa đăng nhập")
        toast.error("Vui lòng đăng nhập để thực hiện hành động");
    }
  };

  const handleWatchLater = async (movie) => {
    if (!movie) return;

    const obj = {
      category:
        movie.category?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      chap: movie.chap || "",
      imdb: movie.imdb || "",
      tmdb: {
        type: movie.tmdb?.type || "",
        id: movie.tmdb?.id || "",
        season: movie.tmdb?.season || null,
        vote_average: movie.tmdb?.vote_average || 0,
        vote_count: movie.tmdb?.vote_count || 0,
      },
      img: movie.img || "",
      lang: movie.lang || "",
      name: movie.name || "",
      originName: movie.origin_name || "",
      poster_url: movie.poster_url || "",
      quality: movie.quality || "",
      slug: movie.slug || "",
      time: movie.time || "",
      year: movie.year || new Date().getFullYear(),
    };

    try {
      const res = await axiosInstance.post("/handleWatchLater", obj, {
        withCredentials: true,
      });
      if (res.data.message === "Đã xóa khỏi danh sách xem sau") {
        toast.info("Đã xóa khỏi danh sách xem sau");
      } else if (res.data.message === "Thêm vào danh sách xem sau thành công") {
        toast.success("Đã thêm phim vào danh sách xem sau");
      }
    } catch (error) {
      console.log("Lỗi khi thêm vào danh sách xem sau:", error);
      if (error.response?.data?.message === "Chưa đăng nhập")
        toast.error("Vui lòng đăng nhập để thực hiện hành động");
    }
  };

  const handleRemoveLoveFilm = (movie) => {
    setFavoriteMovies(favoriteMovies.filter((item) => item.slug != movie.slug));
  };

  const handleRemoveWatchLaterFilm = (movie) => {
    setWatchLaterMovies(
      watchLaterMovies.filter((item) => item.slug != movie.slug)
    );
  };

  async function fetchData() {
    try {
      const res = await axiosInstance.get("/getUserInfor", {
        withCredentials: true,
      });
      setUser(res.data);
      setFavoriteMovies(
        res.data.loveFilms.filter((item) => item.isDeleted == false)
      );
      setContinueWatchingMovies(
        res.data.watchContinues.filter((item) => item.isDeleted == false)
      );
      setWatchLaterMovies(
        res.data.watchLaters.filter((item) => item.isDeleted == false)
      );
      setUserForUpdate({
        username: res.data.username,
        password: res.data.password,
        avt: res.data.avt,
        gg_id: "",
      });
      setUserName(res.data.username);
      setSelectedAvatar(res.data.avt);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLogout() {
    try {
      const res = await axiosInstance.post(
        "/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        updateCurUser();
        navigate("/login");
      } else {
        console.warn(res.data.message);
      }
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
  }

  useEffect(() => {
    fetchData();
    updateCurUser();
  }, [id]);

  const renderMovieGrid = (movies, showProgress = false) => {
    return (
      <Row className="g-3 mp-equal-height-columns">
        {movies.map((movie) => (
          <Col xs={6} sm={4} md={3} key={movie.slug}>
            <div className="mp-movie-card">
              <img
                src={movie.img ? movie.img : movie.image}
                alt={movie.name}
                onClick={() => {
                  navigate(`/infor/${movie.slug}`);
                }}
              />
              <div className="mp-movie-actions">
                <button
                  className="mp-action-btn"
                  onClick={async () => {
                    const link = await getLinkFirstVideo(movie);
                    navigate(link);
                  }}
                >
                  <Play size={14} />
                </button>
                <button
                  className="mp-action-btn"
                  onClick={() => {
                    navigate(`/infor/${movie.slug}`);
                  }}
                >
                  <Info size={14} />
                </button>
                {!showProgress && (
                  <button
                    className="mp-action-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.isPropagationStopped();
                      if (activeTab == "favorites") {
                        handleLoveFilm(movie);
                        handleRemoveLoveFilm(movie);
                      } else if (activeTab == "watch-later") {
                        handleWatchLater(movie);
                        handleRemoveWatchLaterFilm(movie);
                      }
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="mp-overlay">
                <div
                  className="mp-title"
                  style={{ color: "white" }}
                  title={movie.name}
                >
                  {movie.name}
                </div>
                <div className="mp-info">
                  {movie.nameEp ? `Tập ${movie.nameEp} • ` : ""} {movie.year} •{" "}
                  {movie.quality}
                </div>
                {showProgress && (
                  <ProgressBar
                    now={movie.percentRemain}
                    className="mp-progress"
                  />
                )}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "favorites":
        return (
          <Card className="mp-card mp-main-content-card">
            <Card.Body className="p-4">
              <div className="mb-4">
                <h2 className="text-white fs-3 fw-bold mp-gradient-heading">
                  Yêu thích
                </h2>
                <p className="mp-text-secondary">
                  Danh sách phim bạn đã yêu thích
                </p>
              </div>
              <div className="mp-scrollable-content">
                {renderMovieGrid(favoriteMovies)}
              </div>
            </Card.Body>
          </Card>
        );
      case "watch-later":
        return (
          <Card className="mp-card mp-main-content-card">
            <Card.Body className="p-4">
              <div className="mb-4">
                <h2 className="text-white fs-3 fw-bold mp-gradient-heading">
                  Xem sau
                </h2>
                <p className="mp-text-secondary">
                  Danh sách phim bạn muốn xem sau
                </p>
              </div>
              <div className="mp-scrollable-content">
                {renderMovieGrid(watchLaterMovies)}
              </div>
            </Card.Body>
          </Card>
        );
      case "continue-watching":
        return (
          <Card className="mp-card mp-main-content-card">
            <Card.Body className="p-4">
              <div className="mb-4">
                <h2 className="text-white fs-3 fw-bold mp-gradient-heading">
                  Xem tiếp
                </h2>
                <p className="mp-text-secondary">
                  Tiếp tục xem những phim bạn đang xem dở
                </p>
              </div>
              <div className="mp-scrollable-content">
                {renderMovieGrid(continueWatchingMovies, true)}
              </div>
            </Card.Body>
          </Card>
        );
      case "account":
      default:
        return (
          <Card className="mp-card mp-main-content-card">
            <Card.Body className="p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                <div>
                  <h2 className="text-white fs-3 fw-bold mp-gradient-heading">
                    Tài khoản
                  </h2>
                  <p className="mp-text-secondary">
                    Cập nhật thông tin tài khoản
                  </p>
                </div>
              </div>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="mp-form-label">
                      Tên hiển thị
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={userName}
                      onChange={(e) => {
                        setUserName(e.target.value);
                        setUserForUpdate({
                          ...userForUpdate,
                          username: e.target.value,
                        });
                      }}
                      className="mp-form-control"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="mp-form-label">Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      value={user ? user.password : ""}
                      readOnly
                      className="mp-form-control"
                      disabled
                    />
                  </Form.Group>

                  <Button
                    style={{
                      backgroundColor: "rgb(235,200,113)",
                      border: "none",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                    onClick={handleUpdateProfile}
                    className="mb-3 mp-btn"
                  >
                    Cập nhật
                  </Button>

                  <p className="mp-text-secondary">
                    Đổi mật khẩu, nhấn vào{" "}
                    <Button
                      variant="link"
                      onClick={() => setShowPasswordModal(true)}
                      className="p-0 text-decoration-none"
                      style={{ color: "rgb(235,200,113)" }}
                    >
                      đây
                    </Button>
                  </p>
                </Col>

                <Col md={4} className="text-center">
                  <div className="position-relative d-inline-block">
                    <Image
                      src={selectedAvatar || "/placeholder.svg"}
                      alt="User avatar"
                      roundedCircle
                      className="mp-rounded-circle"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        border: "4px solid rgb(235, 200, 113)",
                        boxShadow: "0 8px 20px rgba(235, 200, 113, 0.2)",
                      }}
                    />
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center opacity-0 mp-hover-opacity-100"
                      style={{
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                        opacity: 0,
                      }}
                      onClick={() => setShowAvatarModal(true)}
                      onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
                      onMouseOut={(e) => (e.currentTarget.style.opacity = 0)}
                    >
                      <span className="text-white">Đổi ảnh</span>
                    </div>
                  </div>
                  <p className="mt-3 mp-text-secondary">
                    Nhấn vào ảnh để thay đổi
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
    }
  };

  return (
    <div className="mp-container mp-animated-bg">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Flip}
      />

      <Container className="py-5">
        <Row className="g-4 mp-equal-height-columns">
          {/* Sidebar */}
          <Col md={3}>
            <Card className="mp-card mp-sidebar-card">
              <Card.Body className="p-4">
                <h3 className="mb-4 text-white mp-gradient-heading">
                  Quản lý tài khoản
                </h3>
                <div className="d-flex flex-column gap-2">
                  <Button
                    variant={
                      activeTab === "favorites" ? "warning-user" : "dark-user"
                    }
                    className="text-start d-flex align-items-center mp-btn"
                    style={{
                      backgroundColor:
                        activeTab === "favorites"
                          ? "rgb(235,200,113)"
                          : "#2A2C39",
                      border: "none",
                      color: activeTab === "favorites" ? "#000" : "#fff",
                    }}
                    onClick={() => setActiveTab("favorites")}
                  >
                    <Heart size={18} className="me-2" />
                    Yêu thích
                  </Button>

                  <Button
                    variant={
                      activeTab === "watch-later" ? "warning-user" : "dark-user"
                    }
                    className="text-start d-flex align-items-center mp-btn"
                    style={{
                      backgroundColor:
                        activeTab === "watch-later"
                          ? "rgb(235,200,113)"
                          : "#2A2C39",
                      border: "none",
                      color: activeTab === "watch-later" ? "#000" : "#fff",
                    }}
                    onClick={() => setActiveTab("watch-later")}
                  >
                    <Plus size={18} className="me-2" />
                    Xem sau
                  </Button>

                  <Button
                    variant={
                      activeTab === "continue-watching"
                        ? "warning-user"
                        : "dark-user"
                    }
                    className="text-start d-flex align-items-center mp-btn"
                    style={{
                      backgroundColor:
                        activeTab === "continue-watching"
                          ? "rgb(235,200,113)"
                          : "#2A2C39",
                      border: "none",
                      color:
                        activeTab === "continue-watching" ? "#000" : "#fff",
                    }}
                    onClick={() => setActiveTab("continue-watching")}
                  >
                    <RotateCcw size={18} className="me-2" />
                    Xem tiếp
                  </Button>

                  <Button
                    variant={
                      activeTab === "account" ? "warning-user" : "dark-user"
                    }
                    className="text-start d-flex align-items-center mp-btn"
                    style={{
                      backgroundColor:
                        activeTab === "account"
                          ? "rgb(235,200,113)"
                          : "#2A2C39",
                      border: "none",
                      color: activeTab === "account" ? "#000" : "#fff",
                    }}
                    onClick={() => setActiveTab("account")}
                  >
                    <User size={18} className="me-2" />
                    Tài khoản
                  </Button>

                  <hr className="my-3 bg-secondary" />

                  <Button
                    variant="dark"
                    className="text-start d-flex align-items-center mp-btn"
                    style={{ backgroundColor: "#2A2C39", border: "none" }}
                    onClick={() => handleLogout()}
                  >
                    <LogOut size={18} className="me-2" />
                    Đăng xuất
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col md={9}>{renderTabContent()}</Col>
        </Row>
      </Container>

      {/* Password Change Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        contentClassName="bg-dark text-white border-0"
        className="mp-modal"
      >
        <Modal.Header className="border-0">
          <Modal.Title className="text-center w-100">Đổi mật khẩu</Modal.Title>
          <Button
            variant="link"
            onClick={() => handleCloseModal()}
            className="p-0 ms-auto text-white"
          >
            <span aria-hidden="true">&times;</span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="mp-form-label">Mật khẩu cũ</Form.Label>
            <Form.Control
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mp-form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="mp-form-label">Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setUserForUpdate({
                  ...userForUpdate,
                  password: e.target.value,
                });
              }}
              className="mp-form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="mp-form-label">
              Nhập lại mật khẩu mới
            </Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mp-form-control"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button
            style={{
              backgroundColor: "rgb(235,200,113)",
              border: "none",
              color: "#000",
              fontWeight: "bold",
            }}
            onClick={handlePasswordChange}
            className="mp-btn"
          >
            Đổi mật khẩu
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
            className="mp-btn"
          >
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Avatar Selection Modal */}
      <Modal
        show={showAvatarModal}
        onHide={() => setShowAvatarModal(false)}
        size="lg"
        contentClassName="bg-dark text-white border-0"
        className="mp-modal"
      >
        <Modal.Header className="border-0">
          <Modal.Title>Đổi ảnh đại diện</Modal.Title>
          <Button
            variant="link"
            onClick={() => setShowAvatarModal(false)}
            className="p-0 ms-auto text-white"
          >
            <span aria-hidden="true">&times;</span>
          </Button>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Row className="g-3">
            {avatarList.map((avatar, index) => (
              <Col xs={4} sm={3} md={2} key={index}>
                <div
                  className={`position-relative rounded overflow-hidden mp-avatar-grid-item ${
                    selectedAvatar === avatar ? "mp-selected" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredAvatar(avatar)}
                  onMouseLeave={() => setHoveredAvatar(null)}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  <Image
                    src={avatar || "/placeholder.svg"}
                    alt="Avatar option"
                    fluid
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      transition: "all 0.3s ease",
                      filter:
                        hoveredAvatar === avatar
                          ? "brightness(1.2)"
                          : "brightness(0.9)",
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-end">
          <Button
            style={{
              backgroundColor: "rgb(235,200,113)",
              border: "none",
              color: "#000",
              fontWeight: "bold",
            }}
            onClick={handleAvatarSave}
            className="mp-btn"
          >
            Lưu
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowAvatarModal(false)}
            className="mp-btn"
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
