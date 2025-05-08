import { useEffect, useState, useCallback } from "react";
import login_bg from "../assets/images/login_bg.jpg";
function Search({ state, what }) {
  const [value, setValue] = useState("");
  const { setKeyWord } = state;
  const { setUseWhat } = what;
  const handleSubmit = useCallback(() => {
    setKeyWord({
      key: value,
      page: 1,
    });
    setUseWhat("search");
    setValue("");
  }, [value]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [value, handleSubmit]);
  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${login_bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "multiply",
          padding: 30,
          borderRadius: 8,
        }}
      >
        <h2 style={{ color: "rgb(235, 200, 113)" }}>
          MetaFilm tuyệt đối điện ảnh
        </h2>
        <div
          id="search-box"
          style={{
            display: "flex",
          }}
        >
          <input
            type="text"
            className="form-control"
            id="search"
            value={value}
            style={{
              border: "1px solid rgb(85, 85, 85)",
              borderRadius: ".25rem 0 0 .25rem",
              backgroundColor: "rgb(68, 68, 68)",
              color: "white",
              placeholder: "white",
            }}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button
            className="btn btn-warning"
            style={{
              borderRadius: "0rem .25rem .25rem .0rem",
              fontWeight: "bold",
              backgroundColor: "rgb(235, 200, 113)",
            }}
            onClick={() => {
              handleSubmit();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(0, 0, 0, 1)" }}
            >
              <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Search;
