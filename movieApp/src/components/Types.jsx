import { useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";

function Type({ list }) {
  const containerRef = useRef();
  const [isWrapped, setIsWrapped] = useState(false);
  const [itemHeight, setItemHeight] = useState(180);

  const pairColors = [
    ["#3B5284", "#5BA8A0"],
    ["#5BA8A0", "#CBE5AE"],
    ["#CBE5AE", "#94B447"],
    ["#94B447", "#5D6E1E"],
    ["#5D6E1E", "#5BA8A0"],
    ["#C73866", "#FE676E"],
    ["#FE676E", "#FD8F52"],
    ["#FD8F52", "#FFBD71"],
    ["#FFBD71", "#FFDCA2"],
    ["#FFDCA2", "#FF7A7B"],
    ["#264D59", "#43978D"],
    ["#43978D", "#F9E07F"],
    ["#F9E07F", "#F9AD6A"],
    ["#F9AD6A", "#43978D"],
    ["#D46C4E", "#F9AD6A"],
    ["#FF7B89", "#8A5082"],
    ["#6F5F90", "#758EB7"],
    ["#A5CAD2", "#FF7B89"],
    ["#5AA7A7", "#96D7C6"],
    ["#96D7C6", "#BAC94A"],
    ["#E2D36B", "#96D7C6"],
    ["#BFB8DA", "#E8B7D4"],
    ["#DDDDDA", "#7697A0"],
    ["#E06C78", "#FA9284"],
    ["#5874DC", "#E06C78"],
    ["#68B2A0", "#CDE0C9"],
    ["#E0ECDE", "#CDE0C9"],
    ["#FAA7B8", "#FB7B8E"],
    ["#D3E7EE", "#ABD1DC"],
    ["#F9E2AE", "#A7D676"],
    ["#BFB8DA", "#E8B7D4"],
    ["#FA9284", "#384E78"],
    ["#FFFFFF", "#68B2A0"],
    ["#7BD5F5", "#787FF6"],
    ["#86E3CE", "#D0E6A5"],
    ["#D0E6A5", "#FFDD94"],
    ["#FFDD94", "#FA897B"],
    ["#FA897B", "#CCABD8"],
  ];

  const checkFlexWrap = () => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.children;
    if (items.length < 2) {
      setIsWrapped(false);
      return;
    }

    const firstRow = Array.from(items).filter(
      (item) => item.offsetTop === items[0].offsetTop
    );
    setItemHeight(containerRef.current.children[0].offsetHeight);
    setIsWrapped(firstRow.length < items.length);
  };
  useEffect(() => {
    const handleResize = () => {
      checkFlexWrap();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    checkFlexWrap();
  }, []);

  const getRandomIndex = () => Math.floor(Math.random() * pairColors.length);

  const generateLinearGradient = () => {
    const index = getRandomIndex();
    const [c1, c2] = pairColors[index];
    return `linear-gradient(45deg,${c1},${c2})`;
  };
  const handleClick = () => {
    setIsWrapped(!isWrapped);
  };
  return (
    <div className="listType">
      <h3
        style={{
          background:
            "linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(247, 161, 11) 130%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Bạn đang quan tâm gì?
      </h3>
      <div
        className="listContainer"
        style={{
          display: "flex",
          flexWrap: "wrap",
          overflow: "hidden",
          maxHeight: isWrapped ? itemHeight : "none",
        }}
        ref={containerRef}
      >
        {list.map((item) => (
          <Link
            key={item._id}
            to={`/listType/${item.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div
              className="type-item"
              style={{
                background: generateLinearGradient(),
              }}
            >
              <p className="type-text">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ padding: 10 }}>
        <button
          className="btn btn-secondary"
          onClick={() => {
            handleClick();
          }}
        >
          {isWrapped ? "Xem thêm" : "Ẩn bớt"}
        </button>
      </div>
    </div>
  );
}

export default memo(Type);
