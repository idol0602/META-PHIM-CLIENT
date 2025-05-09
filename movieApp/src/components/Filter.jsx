"use client";

import { useEffect, useState, useRef } from "react";
import { Card, Form, Row, Col, Container } from "react-bootstrap";
import {
  FiFilter,
  FiFilm,
  FiTag,
  FiGlobe,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";
import Select from "./Select";
import API from "../api/index";
import { type } from "../global/Type";
import { useLocation } from "react-router-dom";

function MovieFilter({ activeItem, state, what }) {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [nations, setNations] = useState([]);
  const [years, setYears] = useState([]);
  const [sortFields, setSortFields] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let categoryData = await API.getCategories();
        categoryData = categoryData.filter((item) => item.slug != "phim-18");
        setCategories(categoryData);
        setTypes(type);
        setNations(await API.getNations());
        setYears(generateYearList());
        setSortFields([
          { _id: 1, slug: "modified.time", name: "Ngày cập nhật" },
          { _id: 2, slug: "year", name: "Năm sản xuất" },
          { _id: 3, slug: "tmdb.vote_average", name: "Điểm đánh giá" },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const generateYearList = () => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let i = 0; i < 20; i++) {
      const year = currentYear - i;
      yearList.push({
        _id: i + 1,
        name: year.toString(),
        slug: year.toString(),
      });
    }

    const secondLastYear = currentYear - 19;
    const randomYearBefore =
      secondLastYear - Math.floor(Math.random() * 19) - 1;
    yearList.push({
      _id: 21,
      name: `Trước năm ${secondLastYear}`,
      slug: randomYearBefore.toString(),
    });

    return yearList;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Container fluid className="px-0 mb-4 filter-container">
      <Card className="border-0 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white py-2 py-md-3">
          <div className="d-flex align-items-center">
            <FiFilter className="me-2" size={18} />
            <h5 className="mb-0 fs-6 fs-md-5">Bộ lọc phim</h5>
          </div>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={toggleExpand}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Thu gọn" : "Mở rộng"}
          </button>
        </Card.Header>

        <div
          ref={contentRef}
          className={`filter-content ${isExpanded ? "expanded" : "collapsed"}`}
        >
          <Card.Body className="bg-dark bg-opacity-75 text-white p-2 p-md-3">
            <Row className="g-2">
              {/* First row */}
              <Col xs={4} sm={6} md={6} lg={4} xl>
                <div className="filter-item d-flex flex-column">
                  <div className="d-flex align-items-center mb-1">
                    <FiFilm className="me-1" size={16} />
                    <Form.Label className="mb-0 fw-bold small">
                      Loại phim:
                    </Form.Label>
                  </div>
                  <Select
                    title=""
                    id="loaiPhim"
                    name="loaiPhim"
                    data={types}
                    activeItem={activeItem}
                    state={state}
                    what={what}
                    className="flex-grow-1"
                  />
                </div>
              </Col>

              <Col xs={4} sm={6} md={6} lg={4} xl>
                <div className="filter-item d-flex flex-column">
                  <div className="d-flex align-items-center mb-1">
                    <FiTag className="me-1" size={16} />
                    <Form.Label className="mb-0 fw-bold small">
                      Thể loại:
                    </Form.Label>
                  </div>
                  <Select
                    title=""
                    id="theLoai"
                    name="theLoai"
                    data={categories}
                    state={state}
                    what={what}
                    className="flex-grow-1"
                  />
                </div>
              </Col>

              {/* Second row */}
              <Col xs={4} sm={6} md={6} lg={4} xl>
                <div className="filter-item d-flex flex-column">
                  <div className="d-flex align-items-center mb-1">
                    <FiGlobe className="me-1" size={16} />
                    <Form.Label className="mb-0 fw-bold small">
                      Quốc gia:
                    </Form.Label>
                  </div>
                  <Select
                    title=""
                    id="quocGia"
                    name="quocGia"
                    data={nations}
                    state={state}
                    what={what}
                    className="flex-grow-1"
                  />
                </div>
              </Col>

              <Col xs={6} sm={6} md={6} lg={4} xl>
                <div className="filter-item d-flex flex-column">
                  <div className="d-flex align-items-center mb-1">
                    <FiCalendar className="me-1" size={16} />
                    <Form.Label className="mb-0 fw-bold small">Năm:</Form.Label>
                  </div>
                  <Select
                    title=""
                    id="nam"
                    name="nam"
                    data={years}
                    state={state}
                    what={what}
                    className="flex-grow-1"
                  />
                </div>
              </Col>

              {/* Third row - Sắp xếp (full width on mobile) */}
              <Col xs={6} sm={6} md={6} lg={4} xl>
                <div className="filter-item d-flex flex-column">
                  <div className="d-flex align-items-center mb-1">
                    <FiBarChart2 className="me-1" size={16} />
                    <Form.Label className="mb-0 fw-bold small">
                      Sắp xếp:
                    </Form.Label>
                  </div>
                  <Select
                    title=""
                    id="sapXep"
                    name="sapXep"
                    data={sortFields}
                    activeItem={activeItem}
                    state={state}
                    what={what}
                    className="flex-grow-1"
                  />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </div>
      </Card>

      <style>{`
        /* Card bo góc, màu tối */
        .card {
          border-radius: 10px;
          overflow: hidden;
          background-color: #1e1e1e;
          color: #ffffff;
        }

        /* Header của card */
        .card-header {
          background-color: #2b2b2b;
          color: rgb(235, 200, 113);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: bold;
        }

        /* Tiêu đề "Bộ lọc phim" và icon */
        .card-header h5,
        .card-header svg {
          color: rgb(235, 200, 113);
        }

        /* Label của từng filter */
        .form-label {
          color: rgb(235, 200, 113);
          font-weight: 600;
          margin-bottom: 0;
        }

        /* Icon trong từng filter item */
        .filter-item svg {
          color: rgb(235, 200, 113);
        }

        /* Item hiệu ứng nhẹ khi hover */
        .filter-item {
          transition: all 0.3s ease;
          margin-bottom: 8px;
        }

        .filter-item:hover {
          transform: translateY(-2px);
        }

        /* Nền select tối, chữ trắng */
        .form-select {
          background-color: #212529;
          color: #ffffff;
          border: 1px solid #495057;
          border-radius: 6px;
          transition: all 0.2s ease;
          width: 100%;
        }

        /* Option trong select */
        .form-select option {
          background-color: #212529;
          color: #ffffff;
        }

        /* Focus vào select */
        .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(235, 200, 113, 0.3);
          border-color: rgb(235, 200, 113);
        }

        /* Scrollbar tuỳ chỉnh */
        .form-select::-webkit-scrollbar {
          width: 8px;
        }

        .form-select::-webkit-scrollbar-track {
          background: #343a40;
        }

        .form-select::-webkit-scrollbar-thumb {
          background-color: #6c757d;
          border-radius: 4px;
        }

        /* Nút mở rộng / thu gọn */
        .btn-outline-light {
          border-color: rgba(235, 200, 113, 0.5);
          color: rgb(235, 200, 113);
        }
        .btn-outline-light:hover {
          background-color: rgba(235, 200, 113, 0.15);
          color: #fff;
        }

        /* Collapse animation */
        .filter-content {
  transition: max-height 0.3s ease-out, opacity 0.2s ease-out, padding 0.3s ease;
  overflow: hidden;
}

.filter-content.expanded {
  max-height: 1000px;
  opacity: 1;
  padding: 0.5rem 1rem; /* padding khi mở rộng */
}

.filter-content.collapsed {
  max-height: 0;
  opacity: 0;
  padding: 0 !important; /* bỏ padding */
  margin: 0 !important;
  pointer-events: none;
}


        @media (max-width: 768px) {
          .card-header {
            padding: 0.5rem 1rem;
          }
          
          .card-body {
            padding: 0.5rem !important;
          }

          .filter-item {
            margin-bottom: 6px;
          }

          .form-select {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
          }

          .g-2 {
            --bs-gutter-y: 0.5rem;
            --bs-gutter-x: 0.5rem;
          }

          /* Make sure dropdowns are visible */
          .dropdown-menu {
            position: absolute;
            z-index: 1000;
            max-width: calc(100vw - 2rem);
            max-height: 50vh;
            overflow-y: auto;
          }
        }

        @media (max-width: 576px) {
          .card-header h5 {
            font-size: 1rem;
          }
          
          .btn-outline-light {
            padding: 0.25rem 0.5rem;
            font-size: 0.8rem;
          }
          
          .filter-item {
            margin-bottom: 4px;
          }
          
          .form-label.small {
            font-size: 0.8rem;
          }
          
          .form-select {
            font-size: 0.8rem;
            padding: 0.2rem 0.4rem;
          }
        }
      `}</style>
    </Container>
  );
}

export default MovieFilter;
