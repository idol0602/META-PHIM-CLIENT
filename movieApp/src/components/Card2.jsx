"use client";

import { Link } from "react-router-dom";
import API from "../api/index";
import { useEffect, useState } from "react";
import { FaPlay, FaHeart, FaInfoCircle, FaStar, FaClock } from "react-icons/fa";
import { Card, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";

function Card2({ movie }) {
  const [data, setData] = useState();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const infor = await API.getInforMovies(movie.slug);
      setData(infor);
    }
    fetchData();
  }, []);

  const fixMoreThanOneDecimalPlace = (num) => {
    const decimalPart = num.toString().split(".")[1];
    if (decimalPart && decimalPart.length > 1) return num.toFixed(1);
    return num;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Link to={`/infor/${movie.slug}`} style={{ textDecoration: "none" }}>
      <Card
        className="movie-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "100%",
          border: "none",
          overflow: "hidden",
          backgroundColor: "transparent",
          borderRadius: "10px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          transform: isHovered ? "translateY(-5px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 10px 20px rgba(0, 0, 0, 0.4)"
            : "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "15px",
        }}
      >
        <div className="image-container position-relative">
          <div
            className="image-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: isHovered
                ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.3) 100%)"
                : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)",
              zIndex: 1,
              transition: "background 0.3s ease",
              borderRadius: "10px 10px 0 0",
            }}
          />

          <img
            src={API.getLinkImage(movie.img) || "/placeholder.svg"}
            alt={movie.name}
            className="card-img-top"
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
              borderRadius: "10px 10px 0 0",
              transition: "transform 0.5s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />

          {/* IMDb Rating */}
          <Badge
            bg="warning"
            text="dark"
            className="position-absolute"
            style={{
              top: "10px",
              right: "10px",
              zIndex: 2,
              padding: "6px 8px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FaStar /> {fixMoreThanOneDecimalPlace(movie.imdb)}
          </Badge>

          {/* Chapter info */}
          {movie.chap && (
            <Badge
              bg="dark"
              className="position-absolute"
              style={{
                bottom: "10px",
                left: "10px",
                zIndex: 2,
                padding: "6px 8px",
                fontSize: "0.75rem",
                opacity: "0.9",
                borderRadius: "5px",
              }}
            >
              {movie.chap}
            </Badge>
          )}

          {/* Play button overlay on hover */}
          {isHovered && (
            <div
              className="play-button position-absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(5px)",
                  border: "2px solid white",
                  cursor: "pointer",
                }}
              >
                <FaPlay color="white" size={20} />
              </div>
            </div>
          )}

          {/* Action buttons on hover */}
          {isHovered && (
            <div
              className="action-buttons position-absolute d-flex"
              style={{
                bottom: "15px",
                right: "10px",
                zIndex: 2,
                gap: "10px",
              }}
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Xem thông tin</Tooltip>}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "35px",
                    height: "35px",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    backdropFilter: "blur(5px)",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(13, 110, 253, 0.8)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.6)")
                  }
                >
                  <FaInfoCircle color="white" size={15} />
                </div>
              </OverlayTrigger>
            </div>
          )}
        </div>

        <Card.Body
          style={{
            backgroundColor: "#1e2330",
            borderRadius: "0 0 10px 10px",
            padding: "15px",
            transition: "background-color 0.3s ease",
            height: "auto",
            minHeight: "90px",
          }}
        >
          <div className="d-flex flex-column">
            <h5
              className="mb-1 text-truncate"
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                color: "white",
                marginBottom: "5px",
              }}
            >
              {truncateText(movie.name, 20)}
            </h5>

            <p
              className="mb-1 text-truncate"
              style={{
                fontSize: "0.85rem",
                color: "rgb(235, 200, 113)",
                marginBottom: "5px",
              }}
            >
              {truncateText(movie.originName, 25)}
            </p>

            <div
              className="d-flex align-items-center"
              style={{
                fontSize: "0.75rem",
                color: "#adb5bd",
              }}
            >
              <FaClock size={10} style={{ marginRight: "5px" }} />
              {movie.time}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default Card2;
