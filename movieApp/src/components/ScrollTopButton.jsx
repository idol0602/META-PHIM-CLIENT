import { useState, useEffect } from "react";

function ScrollTopButton() {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        right: showButton ? 20 : "-100px",
        opacity: showButton ? 1 : 0,
        transition: "right 0.5s ease-out, opacity 0.5s ease-out",
        zIndex: 10,
      }}
    >
      <button
        className="btn btn-warning"
        style={{
          backgroundColor: "rgb(235, 200, 113)",
          width: 100,
          opacity: 0.7,
          color: "rgb(235, 200, 113) !important",
          fontWeight: "bold",
        }}
        onClick={() => {
          scrollToTop();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{ fill: "rgba(0, 0, 0, 1)" }}
        >
          <path d="M11 8.414V18h2V8.414l4.293 4.293 1.414-1.414L12 4.586l-6.707 6.707 1.414 1.414z"></path>
        </svg>
      </button>
    </div>
  );
}

export default ScrollTopButton;
