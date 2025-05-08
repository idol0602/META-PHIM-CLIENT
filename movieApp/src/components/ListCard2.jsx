"use client";

import { useState, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Card2 from "./Card2";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function MovieList({ title = "Top 5 phim trong tháng", movies = [] }) {
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef(null);

  console.log("movies:", movies);

  // Hàm cuộn danh sách phim
  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 220;

    if (container) {
      if (direction === "left") {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  // Nếu không có phim, hiển thị thông báo
  if (!movies || movies.length === 0) {
    return (
      <Container fluid className="movie-list-container py-4">
        <h2 className="section-title mb-4 text-white">{title}</h2>
        <div className="text-center py-5 text-secondary">
          Không có phim nào để hiển thị
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="movie-list-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="section-title text-white">{title}</h4>

        {/* Nút điều hướng cho màn hình lớn */}
        {/* <div className="d-none d-md-flex">
                    <Button
                        variant="outline-light"
                        className="me-2 d-flex align-items-center justify-content-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            padding: 0,
                            backgroundColor: "rgba(30, 35, 48, 0.8)",
                            borderColor: "#374151",
                        }}
                        onClick={() => scroll("left")}
                    >
                        <FaChevronLeft />
                    </Button>
                    <Button
                        variant="outline-light"
                        className="d-flex align-items-center justify-content-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            padding: 0,
                            backgroundColor: "rgba(30, 35, 48, 0.8)",
                            borderColor: "#374151",
                        }}
                        onClick={() => scroll("right")}
                    >
                        <FaChevronRight />
                    </Button>
                </div> */}
      </div>

      {/* Hiển thị dạng lưới trên màn hình nhỏ */}
      <div className="d-block d-md-none">
        <Row className="g-3">
          {movies.slice(0, 5).map((movie, index) => (
            <Col xs={6} key={index}>
              <Card2 movie={movie} />
            </Col>
          ))}
        </Row>
      </div>

      {/* Hiển thị dạng cuộn ngang trên màn hình lớn */}
      <div
        className="d-none d-md-block position-relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Nút cuộn trái */}
        {isHovering && (
          <Button
            variant="dark"
            className="position-absolute start-0 top-50 translate-middle-y z-1 d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              padding: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              border: "none",
              opacity: 0.9,
              marginLeft: "-10px",
              zIndex: 10,
            }}
            onClick={() => scroll("left")}
          >
            <FaChevronLeft />
          </Button>
        )}

        {/* Danh sách phim cuộn ngang */}
        <div
          ref={scrollRef}
          className="d-flex overflow-auto pb-1"
          style={{
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          {movies.slice(0, 5).map((movie, index) => (
            <div
              key={index}
              style={{
                minWidth: "220px",
                maxWidth: "220px",
                marginRight: "20px",
              }}
            >
              <Card2 movie={movie} />
            </div>
          ))}
        </div>

        {/* Nút cuộn phải */}
        {isHovering && (
          <Button
            variant="dark"
            className="position-absolute end-0 top-50 translate-middle-y z-1 d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              padding: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              border: "none",
              opacity: 0.9,
              marginRight: "-10px",
              zIndex: 10,
            }}
            onClick={() => scroll("right")}
          >
            <FaChevronRight />
          </Button>
        )}
      </div>
    </Container>
  );
}

export default MovieList;
