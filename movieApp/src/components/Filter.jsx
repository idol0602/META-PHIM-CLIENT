"use client";

import { useEffect, useState } from "react";
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

// Make sure to import the CSS
// import "../styles/MovieFilter.css"

function MovieFilter({ activeItem, state, what }) {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [nations, setNations] = useState([]);
  const [years, setYears] = useState([]);
  const [sortFields, setSortFields] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

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
    <Container fluid className="px-0 mb-4">
      <Card className="border-0 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white py-3">
          <div className="d-flex align-items-center">
            <FiFilter className="me-2" size={18} />
            <h5 className="mb-0">Bộ lọc phim</h5>
          </div>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={toggleExpand}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Thu gọn" : "Mở rộng"}
          </button>
        </Card.Header>

        {isExpanded && (
          <Card.Body className="bg-dark bg-opacity-75 text-white">
            <Row className="g-3">
              <Col xs={12} md={6} lg={4} xl>
                <div className="filter-item d-flex flex-column h-100">
                  <div className="d-flex align-items-center mb-2">
                    <FiFilm className="me-2" />
                    <Form.Label className="mb-0 fw-bold">Loại phim:</Form.Label>
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

              <Col xs={12} md={6} lg={4} xl>
                <div className="filter-item d-flex flex-column h-100">
                  <div className="d-flex align-items-center mb-2">
                    <FiTag className="me-2" />
                    <Form.Label className="mb-0 fw-bold">Thể loại:</Form.Label>
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

              <Col xs={12} md={6} lg={4} xl>
                <div className="filter-item d-flex flex-column h-100">
                  <div className="d-flex align-items-center mb-2">
                    <FiGlobe className="me-2" />
                    <Form.Label className="mb-0 fw-bold">Quốc gia:</Form.Label>
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

              <Col xs={12} md={6} lg={4} xl>
                <div className="filter-item d-flex flex-column h-100">
                  <div className="d-flex align-items-center mb-2">
                    <FiCalendar className="me-2" />
                    <Form.Label className="mb-0 fw-bold">Năm:</Form.Label>
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

              <Col xs={12} md={6} lg={4} xl>
                <div className="filter-item d-flex flex-column h-100">
                  <div className="d-flex align-items-center mb-2">
                    <FiBarChart2 className="me-2" />
                    <Form.Label className="mb-0 fw-bold">Sắp xếp:</Form.Label>
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
        )}
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


      `}</style>
    </Container>
  );
}

export default MovieFilter;
