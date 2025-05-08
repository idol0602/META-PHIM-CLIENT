import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { LoginContext } from "../global/LoginContext";
import API from "../api/index";
import VideoPlayer from "../components/VideoPlayer";
import ListEp from "../components/ListEp";
import { Link } from "react-router-dom";
import axiosInstance from "../global/axiosInstance";
import { toast } from "react-toastify";
import "../assets/css/infor.css";
import LoadingOverlay from "../components/LoadingOverlay";
import ListComment from "../components/ListComment";
import ShareModal from "../components/ShareModal";
import { ToastContainer } from "react-toastify";
import {
  FaPlay,
  FaHeart,
  FaCommentDots,
  FaPlus,
  FaShare,
  FaCheck,
} from "react-icons/fa";

function Infor() {
  const [open, setOpen] = useState(false);
  const currentUrl = window.location.href;
  const { user, updateCurUser } = useContext(LoginContext);
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const fixMoreThanOneDecimalPlace = (num) => {
    let decimalPart = num.toString().split(".")[1];
    if (decimalPart && decimalPart.length > 1) return num.toFixed(1);
    return num;
  };
  const [isLiked, setIsLiked] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleWatchLater = () => {
    setIsWatchLater(!isWatchLater);
  };
  const handleLoveFilm = async () => {
    if (!movie) return;
    const obj = {
      category:
        movie.category?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      chap: movie.episode_current || "",
      imdb: movie.imdb?.id || "",
      tmdb: {
        type: movie.tmdb?.type || "",
        id: movie.tmdb?.id || "",
        season: movie.tmdb?.season || null,
        vote_average: movie.tmdb?.vote_average || 0,
        vote_count: movie.tmdb?.vote_count || 0,
      },
      img: movie.thumb_url || "",
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

  const handleWatchLater = async () => {
    if (!movie) return;
    const obj = {
      category:
        movie.category?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      chap: movie.episode_current || "",
      imdb: movie.imdb?.id || "",
      tmdb: {
        type: movie.tmdb?.type || "",
        id: movie.tmdb?.id || "",
        season: movie.tmdb?.season || null,
        vote_average: movie.tmdb?.vote_average || 0,
        vote_count: movie.tmdb?.vote_count || 0,
      },
      img: movie.thumb_url || "",
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

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await API.getInforMovies(slug);
        setMovie(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
    updateCurUser();
  }, [slug]);

  useEffect(() => {
    if (user) {
      setIsLiked(
        user._doc.loveFilms.some(
          (item) => item.slug == slug && item.isDeleted == false
        )
      );
      setIsWatchLater(
        user._doc.watchLaters.some(
          (item) => item.slug == slug && item.isDeleted == false
        )
      );
    }
  }, []);

  if (!movie) {
    return <LoadingOverlay isLoading={movie == null}></LoadingOverlay>;
  }

  return (
    <div>
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
      <ShareModal
        isOpen={open}
        onClose={() => setOpen(false)}
        link={currentUrl}
      />
      <div className="row" style={{ margin: 0 }}>
        <div className="poster col-12" style={{ padding: 0 }}>
          <img
            src={movie.poster_url}
            alt="Movie Poster"
            style={{
              width: "100%",
              height: "80vh",
              objectFit: "cover",
              objectPosition: "center",
              maskImage:
                "linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)",
            }}
          />
        </div>
      </div>
      <div className="row card-infor g-0">
        <div
          className="col-md-4 col-12"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div className="col-md-10 col-10">
            <div
              className="card"
              style={{ backgroundColor: "rgb(25, 28, 36)" }}
            >
              <img src={movie.thumb_url} alt="" className="card-img-top" />
              <div
                className="imdb"
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: 0,
                  right: 0,
                  backgroundColor: "rgb(235, 200, 113)",
                  fontWeight: "bold",
                  padding: "4px",
                  borderRadius: 5,
                }}
              >
                {`IMDb ${fixMoreThanOneDecimalPlace(movie.tmdb.vote_average)}`}
              </div>
              <div className="card-body">
                <h5 className="card-title" style={{ color: "white" }}>
                  {movie.name}
                </h5>
                <p
                  className="card-text"
                  style={{ color: "rgb(235, 200, 113)" }}
                >
                  {movie.origin_name}
                </p>
                <div style={{ display: "flex", marginBottom: 5 }}>
                  <span className="badge bg-secondary me-2">{movie.year}</span>
                  <span className="badge bg-secondary me-2">
                    {movie.quality}
                  </span>
                  <span className="badge bg-secondary me-2">{movie.lang}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {movie.category.map((item) => (
                    <span
                      key={item.id}
                      className="badge bg-secondary me-2 mb-2"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
                <div className="d-md-block d-none">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  >
                    &times;
                  </button>
                  <p style={{ color: "white", fontWeight: "bold" }}>
                    Giới thiệu
                  </p>
                  <div
                    style={{ color: "grey" }}
                    dangerouslySetInnerHTML={{ __html: movie.content }}
                  ></div>
                  <span>
                    <span style={{ color: "white", fontWeight: "bold" }}>
                      Quốc gia:{" "}
                    </span>
                    <span style={{ color: "grey" }}>
                      {movie.country.map((item) => item.name).join(", ")}
                    </span>
                  </span>
                  <br />
                  <br />
                  <span>
                    <span style={{ color: "white", fontWeight: "bold" }}>
                      Đạo diễn:{" "}
                    </span>
                    <span style={{ color: "grey" }}>
                      {movie.director.join(", ") === ""
                        ? "đang cập nhật"
                        : movie.director.join(", ")}
                    </span>
                  </span>
                  <br />
                  <br />
                  <span>
                    <span style={{ color: "white", fontWeight: "bold" }}>
                      Diễn viên:{" "}
                    </span>
                    <span style={{ color: "grey" }}>
                      {movie.actor.join(", ") === ""
                        ? "đang cập nhật"
                        : movie.actor.join(", ")}
                    </span>
                  </span>
                  <br />
                  <br />
                  <span>
                    <span style={{ color: "white", fontWeight: "bold" }}>
                      Trạng thái:{" "}
                    </span>
                    <span style={{ color: "grey" }}>
                      {movie.status == "ongoing"
                        ? "đang cập nhật"
                        : movie.status == "completed"
                        ? "hoàn tất"
                        : movie.status == "trailer"
                        ? "sắp công chiếu"
                        : "trạng thái không xác định"}
                    </span>
                  </span>
                </div>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#myModal"
                  className="d-md-none btn btn-warning"
                  onClick={() => setShowDescription(!showDescription)}
                  style={{
                    border: "none",
                    fontWeight: "bold",
                    marginBottom: 10,
                    cursor: "pointer",
                    background:
                      "linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(247, 161, 11) 130%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {"Thông tin phim "}
                </button>
                <div className="modal" id="myModal">
                  <div className="modal-dialog">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    >
                      X
                    </button>
                    <p style={{ color: "white", fontWeight: "bold" }}>
                      Giới thiệu
                    </p>
                    <div
                      style={{ color: "grey" }}
                      dangerouslySetInnerHTML={{ __html: movie.content }}
                    ></div>
                    <span>
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        Quốc gia:{" "}
                      </span>
                      <span style={{ color: "grey" }}>
                        {movie.country.map((item) => item.name).join(", ")}
                      </span>
                    </span>
                    <br />
                    <br />
                    <span>
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        Đạo diễn:{" "}
                      </span>
                      <span style={{ color: "grey" }}>
                        {movie.director.join(", ") === ""
                          ? "đang cập nhật"
                          : movie.director.join(", ")}
                      </span>
                    </span>
                    <br />
                    <br />
                    <span>
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        Diễn viên:{" "}
                      </span>
                      <span style={{ color: "grey" }}>
                        {movie.actor.join(", ") === ""
                          ? "đang cập nhật"
                          : movie.actor.join(", ")}
                      </span>
                    </span>
                    <br />
                    <br />
                    <span>
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        Trạng thái:{" "}
                      </span>
                      <span style={{ color: "grey" }}>
                        {movie.status == "ongoing"
                          ? "đang cập nhật"
                          : movie.status == "completed"
                          ? "hoàn tất"
                          : movie.status == "trailer"
                          ? "sắp công chiếu"
                          : "trạng thái không xác định"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8 col-12">
          <div
            className="control"
            style={{ fontSize: 20, display: "flex", gap: 5 }}
          >
            <Link
              to={`/watch/${slug}?server=${
                movie.episodes[0].server_name.split("#")[1]
              }&ep=${movie.episodes[0].server_data[0].name}`}
              style={{ textDecoration: "none" }}
            >
              <button
                className="btn btn-warning rounded-pill"
                style={{
                  gap: 5,
                  padding: "12px 18px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  background: "linear-gradient(39deg, #fecf59, #fff1cc)",
                }}
              >
                <FaPlay /> Xem ngay
              </button>
            </Link>
            <button
              onClick={() => {
                toggleLike();
                handleLoveFilm();
              }}
              className="btnInfor btn-hoverInfor"
            >
              {isLiked ? <FaHeart className="heart-active" /> : <FaHeart />}
              {" Yêu thích"}
            </button>

            <button
              onClick={() => {
                toggleWatchLater();
                handleWatchLater();
              }}
              className="btnInfor btn-hoverInfor"
            >
              {isWatchLater ? <FaCheck className="check-active" /> : <FaPlus />}
              {" Xem sau"}
            </button>

            <button
              className="btnInfor btn-hoverInfor"
              onClick={() => setOpen(true)}
            >
              <FaShare />
              {" Chia sẻ"}
            </button>
            <button className="btnInfor btn-hoverInfor">
              <a href="#comments" style={{ all: "unset" }}>
                <FaCommentDots />
                {" Bình luận"}
              </a>
            </button>
          </div>
          <div id="trailer">
            <div
              style={{
                borderBottom: "1px solid rgb(235, 200, 113)",
                padding: 10,
                color: "rgb(235, 200, 113)",
              }}
            >
              <h3>Trailer</h3>
            </div>
            <div
              style={{
                padding: 10,
              }}
            >
              <VideoPlayer
                width="100%"
                height={300}
                link={movie.trailer_url}
              ></VideoPlayer>
            </div>
          </div>
          <ListEp curEp={movie.episode_current} eps={movie.episodes} />
          <ListComment
            currentUser={user}
            link={window.location.href}
          ></ListComment>
        </div>
      </div>
    </div>
  );
}

export default Infor;
