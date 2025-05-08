"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Nav, Tab, ListGroup } from "react-bootstrap"
import OverviewCard from "../components/OverviewCard"
import CustomChart from "../components/Chart"
import { BarChartIcon, LineChartIcon, PieChartIcon } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import axiosInstance from "../global/axiosInstance" // đảm bảo bạn đã cấu hình axiosInstance
import Card2 from "../components/Card2"
import MovieList from "../components/ListCard2"
import API from "../api/index" // đảm bảo bạn đã cấu hình API
import UserManager from "../components/UserManager"

export default function DashboardPage() {
  const [countUser, setCountUser] = useState(0)
  const [category, setCategory] = useState("")
  const [mean, setMean] = useState(0)
  const [view, setView] = useState(0)
  const [movies, setMovies] = useState([])


  const top5Movies = [
    { title: "Avengers: Endgame", views: 12500 },
    { title: "Inception", views: 11300 },
    { title: "Titanic", views: 9800 },
    { title: "The Dark Knight", views: 8700 },
    { title: "Avatar", views: 8500 },
  ];

  const m = {
    "tmdb": {
      "type": "movie",
      "id": "1038263",
      "season": null,
      "vote_average": 6.462,
      "vote_count": 302
    },
    "imdb": {
      "id": "tt22893404"
    },
    "modified": {
      "time": "2025-05-01T21:55:23.000Z"
    },
    "_id": "68138b4064452ad8a883d5a0",
    "name": "Maria (2024)",
    "slug": "maria-2024",
    "origin_name": "Maria",
    "thumb_url": "maria-2024-thumb.jpg",
    "poster_url": "maria-2024-poster.jpg",
    "year": 2024
  }

  const url = [
    "/getTheLoaiYeuThich",
    "/getSoLuongTaiKhoan",
    "/getThoiGianTrungBinh",
    "/getSoLuotXem",
  ]

  const getTop5Movies = async () => {

  }

  const getData = async () => {
    try {
      const [res, res1, res2, res3, res4] = await Promise.all([
        axiosInstance.get(url[0], { withCredentials: true }),
        axiosInstance.get(url[1], { withCredentials: true }),
        axiosInstance.get(url[2], { withCredentials: true }),
        axiosInstance.get(url[3], { withCredentials: true }),
        await API.getTypeMovies("top_movies", 1)
      ])
      setCategory(res.data._id || "Không có")
      setCountUser(res1.data.count || 0)
      setMean(Math.round((res2.data.averageTime || 0) / 60))
      setView(res3.data.total || 0)
      setMovies(res4 || [])
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (


    <Tab.Container defaultActiveKey="overview">
      <Container fluid className="px-0"> 
        <Nav variant="tabs" className="mb-3 bg-dark rounded">
          <Nav.Item>
            <Nav.Link eventKey="overview">Tổng quan</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="user">Quản lý người dùng</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="overview">
            <div
              className="dashboard-container"
              style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #111827, #1f2937)" }}
            >
              {/* <header
                className="sticky-top border-bottom border-secondary"
                style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(17, 24, 39, 0.8)" }}
              >
                <Container fluid>
                  <div className="d-flex align-items-center" style={{ height: "64px" }}>
                    <h1 className="fs-4 fw-semibold text-white mb-0">Dashboard</h1>
                  </div>
                </Container>
              </header> */}

              <main className="py-1 py-md-1">
                <Container>
                  <div className="mb-4">
                    <h2 className="fs-1 fw-bold text-white">Tổng quan</h2>
                    <p className="text-secondary">Xem thông tin tổng quan và số liệu thống kê của bạn</p>
                  </div>

                  <Row className="g-4 mb-4">
                    <Col md={6} lg={3}>
                      <OverviewCard
                        title="Người dùng"
                        value={countUser.toLocaleString()}
                        trend="" // Hoặc bạn có thể tính toán động nếu có
                        trendUp={true}
                        description="Tổng số tài khoản"
                        icon="users"
                      />
                    </Col>
                    <Col md={6} lg={3}>
                      <OverviewCard
                        title="Thể loại yêu thích"
                        value={category}
                        trend=""
                        trendUp={true}
                        description="Thể loại phổ biến nhất"
                        icon="book"
                      />
                    </Col>
                    <Col md={6} lg={3}>
                      <OverviewCard
                        title="Thời gian trung bình"
                        value={`${mean} phút`}
                        trend=""
                        trendUp={true}
                        description="Thời gian xem trung bình"
                        icon="clock"
                      />
                    </Col>
                    <Col md={6} lg={3}>
                      <OverviewCard
                        title="Lượt xem"
                        value={view.toLocaleString()}
                        trend=""
                        trendUp={true}
                        description="Tổng lượt xem"
                        icon="eye"
                      />
                    </Col>
                  </Row>

                  <Row className="g-4 mb-4">
                    <Col md={8}>
                      <Card style={{ backgroundColor: "rgba(31, 41, 55, 0.5)", borderColor: "#374151" }}>
                        <Tab.Container defaultActiveKey="line">
                          <div className="d-flex align-items-center justify-content-between p-3">
                            <h3 className="fs-5 fw-medium text-white mb-0">Phân tích dữ liệu</h3>
                            <Nav variant="pills" className="bg-dark rounded">
                              <Nav.Item>
                                <Nav.Link eventKey="line" className="d-flex align-items-center">
                                  <LineChartIcon size={16} className="me-2" />
                                  Line
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="bar" className="d-flex align-items-center">
                                  <BarChartIcon size={16} className="me-2" />
                                  Bar
                                </Nav.Link>
                              </Nav.Item>
                              
                            </Nav>
                          </div>
                          <Tab.Content mountOnEnter unmountOnExit>
                            <Tab.Pane eventKey="line" className="p-4">
                              <CustomChart type="line" />
                            </Tab.Pane>
                            <Tab.Pane eventKey="bar" className="p-4">
                              <CustomChart type="bar" />
                            </Tab.Pane>
                            
                          </Tab.Content>
                        </Tab.Container>
                      </Card>
                    </Col>

                    <Col md={4}>
                      <Card style={{ backgroundColor: "rgba(31, 41, 55, 0.5)", borderColor: "#374151" }}>

                        <MovieList movies={movies}></MovieList>

                      </Card>
                    </Col>
                  </Row>

                </Container>
              </main>
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="user">
            <UserManager />
          </Tab.Pane>
        </Tab.Content>
      </Container>
    </Tab.Container>

    




  )
}
