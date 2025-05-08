import React from "react";
import { Card, Row, Col, Image, Dropdown } from "react-bootstrap";
import avatar from "/avatar/avtD.png"; // Thay bằng hình của bạn

export default function FilmSummary() {
    return (
        <Card className="p-1 d-flex align-items-center shadow-sm rounded-4 mb-2 mt-2">
            <Row className="w-100 align-items-center text-center text-md-start">
                <Col xs={12} md={2} className="d-flex justify-content-center">
                    <Image
                        src={avatar}
                        roundedCircle
                        width={50}
                        height={50}
                        alt="avatar"
                    />
                </Col>

                <Col xs={12} md={2} className="fw-medium">Nicholas Patrick</Col>

                <Col xs={12} md={2} className="fw-bold text-primary">$2540.58</Col>

                <Col xs={12} md={2} className="text-muted">150 Products</Col>

                <Col xs={12} md={2} className="text-muted">105 Premium</Col>

                <Col xs={12} md={1} className="text-warning fw-medium">+Gold</Col>

                <Col xs={12} md={1} className="text-end">
                    <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm" className="border-0">
                            ⋮
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>View</Dropdown.Item>
                            <Dropdown.Item>Edit</Dropdown.Item>
                            <Dropdown.Item>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
        </Card>
    );
}
