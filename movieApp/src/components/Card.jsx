import { Link } from "react-router-dom";
import API from "../api/index";
import { useEffect, useState, useContext } from "react";
import { FaPlay, FaHeart, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../global/axiosInstance";
import { LoginContext } from "../global/LoginContext";
import "../assets/css/Card.css";

function Card({ movie }) {
  const { user, updateCurUser } = useContext(LoginContext);
  const [linkFirstVideo, setLinkFirstVideo] = useState("#");
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
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
      chap: movie.chap || "",
      imdb: movie.imdb || "",
      tmdb: {
        type: movie.tmdb?.type || "",
        id: movie.tmdb?.id || "",
        season: movie.tmdb?.season || null,
        vote_average: movie.tmdb?.vote_average || 0,
        vote_count: movie.tmdb?.vote_count || 0,
      },
      img: "https://img.ophim.live/uploads/movies/" + movie.img || "",
      lang: movie.lang || "",
      name: movie.name || "",
      originName: movie.originName || "",
      poster_url:
        "https://img.ophim.live/uploads/movies/" + movie.poster_url || "",
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
    updateCurUser();
  };

  useEffect(() => {
    async function fetchData() {
      const eps = await API.getEps(movie.slug);
      const link = `/watch/${movie.slug}?server=${
        eps[0].server_name.split("#")[1]
      }&ep=${eps[0].server_data[0].name}`;
      setLinkFirstVideo(link);
    }
    fetchData();
  }, [movie]);

  useEffect(() => {
    if (user) {
      setIsLiked(
        user._doc.loveFilms.some(
          (item) => item.slug == movie.slug && item.isDeleted == false
        )
      );
    }
  }, []);

  const fixMoreThanOneDecimalPlace = (num) => {
    let decimalPart = num.toString().split(".")[1];
    if (decimalPart && decimalPart.length > 1) return num.toFixed(1);
    return num;
  };
  return (
    <Link to={`/infor/${movie.slug}`} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          overflow: "hidden",
          backgroundColor: "transparent",
          borderRadius: "7px",
          padding: 10,
        }}
      >
        <div className="moreInfor">
          <div style={{ width: "100%", objectFit: "cover" }}>
            <img
              style={{ width: "100%" }}
              src={API.getLinkImage(movie.poster_url)}
              alt=""
            />
          </div>
          <div style={{ padding: 20 }}>
            <p
              style={{
                fontWeight: "bold",
                color: "white",
                marginBottom: 5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {movie.name}
            </p>
            <p
              style={{
                color: "rgb(235, 200, 113)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {movie.originName}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to={linkFirstVideo} style={{ textDecoration: "none" }}>
                <button
                  className="btn btn-warning"
                  style={{
                    backgroundColor: "rgb(235, 200, 113)",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <FaPlay />
                  Xem ngay
                </button>
              </Link>
              <button
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.isPropagationStopped();
                  toggleLike();
                  handleLoveFilm();
                }}
                style={{
                  color: "white",
                  border: "1px solid white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isLiked ? <FaHeart color="red" /> : <FaHeart />}
              </button>
              <button
                className="btn"
                style={{
                  color: "white",
                  border: "1px solid white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaInfoCircle />
              </button>
            </div>
            <br />
            <div style={{ display: "flex", marginBottom: 5 }}>
              <span className="badge bg-secondary me-2">{movie.year}</span>
              <span className="badge bg-secondary me-2">{movie.quality}</span>
              <span className="badge bg-secondary me-2">{movie.lang}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {movie.category.map((item) => (
                <span key={item.id} className="badge bg-secondary me-2 mb-2">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="image-container" style={{ position: "relative" }}>
          <img
            src={API.getLinkImage(movie.img)}
            alt={movie.name}
            className="card-img-top img-thumb"
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover",
            }}
          />
          <div
            className="imdb"
            style={{
              color: "black",
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
            {`IMDb ${fixMoreThanOneDecimalPlace(movie.imdb)}`}
          </div>
          {movie.chap && (
            <div
              className="chap"
              style={{
                position: "absolute",
                zIndex: 1,
                bottom: 0,
                left: 0,
                color: "white",
                fontWeight: "bold",
                padding: "4px",
                borderRadius: 5,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              {movie.chap}
            </div>
          )}
        </div>

        <div
          className="card-body"
          style={{
            backgroundColor: "rgb(47, 52, 71)",
            borderRadius: "0px 0px 7px 7px",
          }}
        >
          <h5
            className="card-title"
            style={{
              color: "white",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {movie.name}
          </h5>
          <p
            className="card-text"
            style={{
              color: "rgb(235, 200, 113)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {movie.originName}
          </p>
          <p
            className="card-text"
            style={{
              color: "grey",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {movie.time}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default Card;
