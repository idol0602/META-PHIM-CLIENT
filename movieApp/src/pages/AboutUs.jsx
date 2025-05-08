import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../assets/css/about-us.module.scss";
import classNames from "classnames/bind";
import { FaInstagram, FaFacebook, FaGithub } from "react-icons/fa";
import ListComment from "../components/ListComment";
import { useContext } from "react";
import { LoginContext } from "../global/LoginContext";

export default function AboutUs() {
  const { user } = useContext(LoginContext);
  const cx = classNames.bind(styles);
  return (
    <div className={cx("about-us-page")}>
      {/* Hero Section */}
      <div className={cx("hero-section", "position-relative", "py-5")}>
        {/* Background Elements */}
        <div className={cx("bg-left")}></div>
        <div className={cx("bg-right")}></div>

        {/* Cards Container */}
        <Container className={cx("position-relative", "z-index-1")}>
          <Row className={cx("justify-content-center", "g-4")}>
            {/* First Team Member Card */}
            <Col md={6} lg={5}>
              <Card className={cx("team-card", "developer-card", "h-100")}>
                <Card.Body
                  className={cx(
                    "d-flex",
                    "flex-column",
                    "flex-md-row",
                    "align-items-center"
                  )}
                >
                  <div className={cx("card-content", "me-md-4")}>
                    <h2 className={cx("card-title", "developer-title")}>
                      Hi! I Am <br />
                      Developer
                    </h2>
                    <p className={cx("card-subtitle", "text-white")}>
                      Frontend & UI Specialist
                    </p>
                  </div>
                  <div className={cx("image-wrapper", "mt-3", "mt-md-0")}>
                    <div className={cx("image-glow", "developer-glow")}></div>
                    <div className={cx("image-container")}>
                      <img
                        src="/avatar/avtD.png"
                        alt="Developer"
                        className={cx("profile-image")}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Second Team Member Card */}
            <Col md={6} lg={5}>
              <Card className={cx("team-card", "designer-card", "h-100")}>
                <Card.Body
                  className={cx(
                    "d-flex",
                    "flex-column",
                    "flex-md-row",
                    "align-items-center"
                  )}
                >
                  <div className={cx("card-content", "me-md-4")}>
                    <h2 className={cx("card-title", "designer-title")}>
                      Hello! I Am <br />
                      Designer
                    </h2>
                    <p className={cx("card-subtitle", "text-white")}>
                      UX & Graphic Designer
                    </p>
                  </div>
                  <div className={cx("image-wrapper", "mt-3", "mt-md-0")}>
                    <div className={cx("image-glow", "designer-glow")}></div>
                    <div className={cx("image-container")}>
                      <img
                        src="/avatar/me.png"
                        alt="Designer"
                        className={cx("profile-image")}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cx("content-section", "py-5")}>
        <Container>
          <Row className={cx("justify-content-center")}>
            <Col md={10} lg={8}>
              <div className={cx("text-center")}>
                <span
                  className={cx("about-badge", "mb-3", "d-inline-block")}
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(235, 200, 113) 0%, rgb(255, 183, 82) 100%)",
                    border: "none",
                    color: "#000",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(235, 200, 113, 0.3)",
                  }}
                >
                  About META PHIM
                </span>
                <p className={cx("content-text")}>
                  <strong>META PHIM</strong> là một sản phẩm nhỏ nhưng đầy tâm
                  huyết của chúng tôi, là kho phim đa dạng và được cập nhật liên
                  tục. Mọi dữ liệu phim thuộc quyền sở hữu của{" "}
                  <a
                    href="https://ophim17.cc/"
                    className={cx("custom-link")}
                    style={{ color: "rgb(235, 200, 113)" }}
                  >
                    ophim17.cc
                  </a>
                  . Hi vọng bạn xem có những giây phút giải trí thật tuyệt vời
                  tại META PHIM ^_^.
                </p>

                <div className={cx("contact-section", "py-4")}>
                  <div className={cx("container")}>
                    <div className={cx("contact-wrapper")}>
                      <h3 className={cx("contact-title")}>Liên hệ:</h3>

                      <div className={cx("social-links-container")}>
                        <a
                          href="https://www.instagram.com/nguyenquan06022004/"
                          className={cx("social-link", "instagram-link")}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className={cx("icon-wrapper")}>
                            <FaInstagram size={22} />
                          </div>
                          <span>Instagram</span>
                        </a>

                        <a
                          href="https://www.facebook.com/profile.php?id=100013568979868"
                          className={cx("social-link", "facebook-link")}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className={cx("icon-wrapper")}>
                            <FaFacebook size={22} />
                          </div>
                          <span>Facebook</span>
                        </a>

                        <a
                          href="https://github.com/nguyenquan06022"
                          className={cx("social-link", "github-link")}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className={cx("icon-wrapper")}>
                            <FaGithub size={22} />
                          </div>
                          <span>GitHub</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <br />
          <Row>
            <ListComment
              currentUser={user}
              link={window.location.href}
            ></ListComment>
          </Row>
        </Container>
      </div>
    </div>
  );
}
