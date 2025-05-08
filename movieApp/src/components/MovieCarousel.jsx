import Skeleton from "@mui/material/Skeleton";
import { LoadingContext } from "../global/LoadingContext";
import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPlay,
  FaHeart,
  FaInfoCircle,
  FaFilm,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import axiosInstance from "../global/axiosInstance";

const MovieCarousel = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [linkFirstVideo, setLinkFirstVideo] = useState("#");
  const { loading } = useContext(LoadingContext);

  const currentMovie = movies[currentIndex];
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallScreen(window.innerWidth < 992);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (currentMovie == null) return;
    const link = `/watch/${currentMovie.slug}?server=${
      currentMovie.firstVideo.server_name.split("#")[1]
    }&ep=${currentMovie.firstVideo.server_data[0].name}`;
    setLinkFirstVideo(link);
  }, [currentMovie]);

  const changeSlide = (newIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setOpacity(0);

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => {
        setOpacity(1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 50);
    }, 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    const newIndex = currentIndex === 0 ? movies.length - 1 : currentIndex - 1;
    changeSlide(newIndex);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    const newIndex = currentIndex === movies.length - 1 ? 0 : currentIndex + 1;
    changeSlide(newIndex);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const getYoutubeId = (url) => {
    if (!url) return "";
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    );
    return match ? match[1] : "";
  };

  const youtubeId =
    currentMovie?.videoId || getYoutubeId(currentMovie?.trailer_url || "");

  const goldColor = "rgb(235, 200, 113)";

  const handleAddLoveFilm = async () => {
    if (!currentMovie) return;

    const obj = {
      category:
        currentMovie.category?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      chap: currentMovie.episode_current || "",
      imdb: currentMovie.imdb?.id || "",
      tmdb: {
        type: currentMovie.tmdb?.type || "",
        id: currentMovie.tmdb?.id || "",
        season: currentMovie.tmdb?.season || null,
        vote_average: currentMovie.tmdb?.vote_average || 0,
        vote_count: currentMovie.tmdb?.vote_count || 0,
      },
      img: currentMovie.thumb_url || "",
      lang: currentMovie.lang || "",
      name: currentMovie.name || "",
      originName: currentMovie.origin_name || "",
      poster_url: currentMovie.poster_url || "",
      quality: currentMovie.quality || "",
      slug: currentMovie.slug || "",
      time: currentMovie.time || "",
      year: currentMovie.year || new Date().getFullYear(),
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

  return (
    <div
      className="position-relative"
      style={{ height: isMobile ? "auto" : "550px", minHeight: "450px" }}
    >
      {/* Background Image */}
      <div
        className="position-absolute w-100 h-100 transition-bg"
        style={{
          backgroundImage: `url(${currentMovie?.poster_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
          transition: "opacity 0.8s ease",
          opacity: opacity * 0.9 + 0.1,
        }}
      >
        <div
          className="position-absolute w-100 h-100 bg-dark"
          style={{ opacity: 0.8, backdropFilter: "blur(5px)" }}
        ></div>
      </div>

      {/* Content */}
      <div
        className="position-relative container h-100 d-flex flex-column flex-lg-row align-items-center justify-content-center p-3 p-md-4 gap-4"
        style={{ zIndex: 1 }}
      >
        {/* Left - Movie Info */}
        <div
          className="col-12 col-lg-5 mb-4 mb-lg-0 transition-element"
          style={{
            transition: "opacity 0.5s ease, transform 0.5s ease",
            opacity: opacity,
            transform: `translateY(${opacity < 1 ? "20px" : "0"})`,
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" height="70vh" />
          ) : (
            <div
              className="card text-white h-100 shadow"
              style={{
                backgroundColor: "rgba(33, 37, 41, 0.7)",
                borderRadius: "12px",
                overflow: "hidden",
                maxWidth: isMobile ? "100%" : "400px",
                margin: "0 auto",
              }}
            >
              <div className="position-relative">
                <div style={{ height: "180px", overflow: "hidden" }}>
                  <img
                    src={currentMovie?.thumb_url}
                    alt={currentMovie?.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div
                  className="position-absolute bottom-0 w-100"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                    height: "50%",
                  }}
                ></div>

                <span
                  className="position-absolute top-0 end-0 m-2 badge"
                  style={{ backgroundColor: goldColor, color: "#000" }}
                >
                  {currentMovie?.quality}
                </span>

                <span className="position-absolute top-0 start-0 m-2 badge bg-dark">
                  {currentMovie?.year}
                </span>
              </div>

              <div className="card-body">
                <h2 className="card-title fs-4 fw-bold">
                  {currentMovie?.name}
                </h2>
                <p style={{ color: goldColor }}>{currentMovie?.origin_name}</p>

                <div className="d-flex gap-2 mb-3">
                  <Link to={linkFirstVideo} style={{ textDecoration: "none" }}>
                    <button
                      className="btn btn-warning d-flex align-items-center gap-1"
                      style={{
                        backgroundColor: goldColor,
                        color: "#000",
                        fontWeight: "500",
                      }}
                    >
                      <FaPlay /> Xem ngay
                    </button>
                  </Link>

                  <button
                    className="btn btn-outline-light"
                    onClick={() => {
                      toggleLike();
                      handleAddLoveFilm();
                    }}
                    style={{ borderWidth: "1px" }}
                  >
                    {isLiked ? <FaHeart color="red" /> : <FaHeart />}
                  </button>

                  <Link
                    to={`/infor/${currentMovie?.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <button
                      className="btn btn-outline-light"
                      style={{ borderWidth: "1px" }}
                    >
                      <FaInfoCircle />
                    </button>
                  </Link>
                </div>

                {/* Only show "Xem trailer" button if isSmallScreen (màn hình nhỏ) */}
                {isSmallScreen && (
                  <div className="mb-3">
                    <button
                      className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        backgroundColor: goldColor,
                        color: "#000",
                        fontWeight: "500",
                      }}
                      onClick={() => setShowTrailer(true)} // Show trailer
                    >
                      <FaFilm /> Xem trailer
                    </button>
                  </div>
                )}

                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-secondary me-2 mb-2">
                    {currentMovie?.lang}
                  </span>
                  {currentMovie?.category?.slice(0, 3).map((cat) => (
                    <span key={cat.id} className="badge bg-secondary me-2 mb-2">
                      {cat.name}
                    </span>
                  ))}
                </div>

                <div className="small text-white">
                  {currentMovie?.director && (
                    <p className="mb-1">
                      <span className="fw-bold">Đạo diễn:</span>{" "}
                      {currentMovie.director.join(", ")}
                    </p>
                  )}
                  {currentMovie?.time && (
                    <p className="mb-0">
                      <span className="fw-bold">Thời lượng:</span>{" "}
                      {currentMovie.time}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right - Trailer on large screen */}
        {!isSmallScreen && (
          <div
            className="col-12 col-lg-6 d-flex align-items-center justify-content-center transition-element"
            style={{
              transition: "opacity 0.5s ease, transform 0.5s ease",
              opacity: opacity,
              transform: `translateY(${opacity < 1 ? "20px" : "0"})`,
            }}
          >
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="50vh" />
            ) : (
              <div
                className="w-100 bg-dark rounded shadow"
                style={{
                  height: "320px",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {youtubeId ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0`}
                    title={`${currentMovie?.name} trailer`}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-muted">
                    No trailer available
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trailer Modal (on small screens) */}
      {showTrailer && (
        <div
          className="position-fixed top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 9999,
          }}
          onClick={() => setShowTrailer(false)}
        >
          <div className="w-75 h-75" onClick={(e) => e.stopPropagation()}>
            <div className="w-100 h-100 bg-dark rounded">
              {youtubeId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title={`${currentMovie?.name} trailer`}
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                  No trailer available
                </div>
              )}
            </div>
            <button
              className="btn btn-danger position-absolute top-0 end-0 m-3"
              onClick={() => setShowTrailer(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Prev/Next Buttons */}
      <div
        className="position-absolute top-50 start-0 translate-middle-y p-3"
        style={{
          zIndex: 2,
          backgroundColor: "transparent",
          color: goldColor,
          cursor: "pointer",
        }}
        onClick={handlePrev}
      >
        <FaChevronLeft />
      </div>
      <div
        className="position-absolute top-50 end-0 translate-middle-y p-3"
        style={{
          zIndex: 2,
          backgroundColor: "transparent",
          color: goldColor,
          cursor: "pointer",
        }}
        onClick={handleNext}
      >
        <FaChevronRight />
      </div>
      {/* Indicator Dots */}
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2"
        style={{ zIndex: 2 }}
      >
        {movies.map((_, index) => (
          <div
            key={index}
            onClick={() => changeSlide(index)}
            style={{
              width: currentIndex === index ? "14px" : "10px",
              height: currentIndex === index ? "14px" : "10px",
              borderRadius: "50%",
              backgroundColor: goldColor,
              opacity: currentIndex === index ? 1 : 0.5,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;
