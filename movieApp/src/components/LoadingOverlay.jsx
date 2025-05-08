"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "../assets/css/loading-overlay.css";

export default function LoadingOverlay({ isLoading = true, onComplete }) {
  const [show, setShow] = useState(isLoading);

  useEffect(() => {
    setShow(isLoading);

    if (!isLoading && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  if (!show) return null;

  return (
    <div
      className={`loading-overlay ${isLoading ? "visible" : "hidden"}`}
      aria-live="polite"
      aria-busy={isLoading}
    >
      <Container className="h-100 d-flex align-items-center justify-content-center">
        <Row>
          <Col className="text-center">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <div className="loading-animation-container">
                {/* Main rotating circle */}
                <div className="rotating-circle"></div>

                {/* Outer pulsating circle */}
                <div className="pulsating-circle"></div>

                {/* Inner rotating circle - opposite direction */}
                <div className="inner-circle"></div>

                {/* Center dot */}
                <div className="center-dot"></div>

                {/* Radiating particles */}
                <div className="particles-container">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="particle"
                      style={{
                        transform: `rotate(${i * 45}deg) translateX(70px)`,
                        animationDelay: `${i * 0.25}s`,
                      }}
                    ></div>
                  ))}
                </div>

                {/* Orbiting elements */}
                <div className="orbit orbit-large">
                  <div className="orbit-dot"></div>
                </div>
                <div className="orbit orbit-small">
                  <div className="orbit-dot"></div>
                </div>
              </div>

              {/* Title */}
              <div className="meta-title">META PHIM</div>

              {/* Progress bar */}
              <div className="progress-container">
                <div className="progress-bar"></div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// Define prop types
LoadingOverlay.propTypes = {
  isLoading: PropTypes.bool,
  onComplete: PropTypes.func,
};
