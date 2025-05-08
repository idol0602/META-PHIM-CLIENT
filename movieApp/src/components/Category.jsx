import { useContext } from "react";
import Card from "./Card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "@mui/material/Skeleton";
import { LoadingContext } from "../global/LoadingContext";
import { Link } from "react-router-dom";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "50px",
        height: "50px",
        background: "rgba(255, 255, 255, 0.5)",
        borderRadius: "50%",
        position: "absolute",
        cursor: "pointer",
        zIndex: 10,
        boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClick}
    >
      ▶
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "50px",
        height: "50px",
        background: "rgba(255, 255, 255, 0.5)",
        borderRadius: "50%",
        position: "absolute",
        cursor: "pointer",
        zIndex: 10,
        boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClick}
    >
      ◀
    </div>
  );
}

function Category({ title, list, slug }) {
  const { loading } = useContext(LoadingContext);

  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className="category" style={{ color: "#ffcc00" }}>
      <div
        className="d-flex"
        style={{
          alignItems: "center",
          borderBottom: "1px solid grey",
          paddingBottom: 5,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(247, 161, 11) 130%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <h3 style={{ padding: 13 }}>{title}</h3>
        </div>
        <div
          style={{
            display: "flex",
          }}
        >
          <Link to={`/list/${slug}`}>
            <button className="btn btn-secondary text-white">
              Xem thêm
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                style={{ fill: "white" }}
              >
                <path d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886z"></path>
              </svg>
            </button>
          </Link>
        </div>
      </div>
      <br />
      <div className="slider-container">
        <Slider {...settings}>
          {loading
            ? Array(8)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    style={{
                      borderRadius: 7,
                      overflow: "hidden",
                      backgroundColor: "transparent",
                    }}
                    className="skeleton-card"
                  >
                    <div>
                      <Skeleton
                        variant="rectangular"
                        sx={{ bgcolor: "rgb(73, 73, 73)" }}
                        animation="wave"
                        className="skeleton-image"
                        style={{ margin: 10, borderRadius: 7 }}
                      />
                      <Skeleton
                        className="skeleton-title"
                        variant="text"
                        sx={{ bgcolor: "rgb(73, 73, 73)" }}
                        animation="wave"
                        style={{ margin: 10 }}
                      />
                      <Skeleton
                        variant="text"
                        sx={{ bgcolor: "rgb(73, 73, 73)" }}
                        animation="wave"
                        style={{ margin: 10 }}
                        className="skeleton-subtitle"
                      />
                    </div>
                  </div>
                ))
            : list.map((item, index) => <Card key={index} movie={item} />)}
        </Slider>
      </div>
    </div>
  );
}

export default Category;
