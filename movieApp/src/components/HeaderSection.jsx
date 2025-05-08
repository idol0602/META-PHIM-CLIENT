import React from "react";
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import avatar from "/avatar/avtD.png"; // Đường dẫn ảnh avatar của bạn
import { FaBell } from "react-icons/fa";

export default function HeaderSection() {
    return (
        <Container fluid className="px-4 py-3 bg-white border-bottom">
            <Row className="align-items-center">
                {/* Tiêu đề */}
                <Col md={4} className="mb-2 mb-md-0">
                    <h4 className="mb-0 fw-bold">Overview</h4>
                    <small className="text-muted">Top Sales Representative</small>
                </Col>

                {/* Select dropdown */}
                <Col md={4} className="d-flex justify-content-md-center justify-content-start mb-2 mb-md-0">
                    <Form.Select className="rounded-pill w-100" style={{ maxWidth: "300px" }}>
                        <option>Select representative</option>
                        <option>Danielle Campbell</option>
                        <option>John Doe</option>
                        <option>Anna Smith</option>
                    </Form.Select>
                </Col>

                {/* Bell + Avatar */}
                <Col md={4} className="d-flex justify-content-end align-items-center">
                    <FaBell size={20} className="text-primary me-3" />
                    <Image src={avatar} roundedCircle width={35} height={35} />
                    <span className="ms-2 fw-medium">Danielle Campbell</span>
                </Col>
            </Row>
        </Container>
    );
}
