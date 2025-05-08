import React, { useEffect, useState, useContext, useRef } from "react";
import Filter from "../components/Filter";
import Search from "../components/Search";
import API from "../api/index";
import Card from "../components/Card";
import PaginationRounded from "../components/PaginationRounded";
import Skeleton from "@mui/material/Skeleton";
import { LoadingContext } from "../global/LoadingContext";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoadingOverlay from "../components/LoadingOverlay";

function ListMovies({ title }) {
  const location = useLocation();
  const movieType = location.pathname.split("/")[2];
  const [useWhat, setUseWhat] = useState("");
  const [activeItem, setActiveItem] = useState({});
  const [listMovies, setListMovies] = useState([]);
  const [pagiSetting, setPagiSetting] = useState({});
  const [keyWord, setKeyWord] = useState({ key: "", page: 1 });
  const [params, setParams] = useState({
    loaiPhim: "",
    theLoai: "",
    quocGia: "",
    nam: "",
    sapXep: "",
    page: 1,
  });
  const { loading, setLoading } = useContext(LoadingContext);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    async function fetchType() {
      setLoading(true);
      let activeConfig;
      switch (movieType) {
        case "top_movies":
          activeConfig = {
            actives: ["tmdb.vote_average", "phim-moi"],
            disables: ["sapXep", "loaiPhim"],
          };
          break;
        case "find_movies":
          activeConfig = { actives: [], disables: [] };
          break;
        default:
          activeConfig = { actives: [movieType], disables: ["loaiPhim"] };
      }
      setActiveItem(activeConfig);

      const list = await API.getTypeMovies(movieType, 1);
      setListMovies(list || []);
      if (list && list.length) setPagiSetting(list[0].pagination);
      setLoading(false);
    }
    fetchType();
    setKeyWord({ key: "", page: 1 });
    setParams((prev) => ({ ...prev, page: 1 }));
  }, [movieType, setLoading]);

  // filter/search
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    async function fetchFiltered() {
      setLoading(true);
      let list = [];
      if (useWhat === "search") {
        list = await API.findMovies(keyWord.key, keyWord.page);
      } else {
        const parameter = {
          moviesType: params.loaiPhim,
          page: params.page,
          sortBy: params.sapXep,
          type: params.theLoai,
          nation: params.quocGia,
          year: params.nam,
        };
        list = await API.searchMovies(parameter);
      }
      setListMovies(list || []);
      if (list && list.length) setPagiSetting(list[0].pagination);
      setLoading(false);
    }
    fetchFiltered();
  }, [params, keyWord, useWhat, setLoading]);
  return (
    <div style={{ padding: "10px 25px 0 25px" }}>
      {loading && <LoadingOverlay />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Filter
        activeItem={activeItem}
        state={{ params, setParams }}
        what={{ useWhat, setUseWhat }}
      />
      {movieType === "find_movies" && (
        <Search
          state={{ keyWord, setKeyWord }}
          what={{ useWhat, setUseWhat }}
        />
      )}
      <br />
      <div
        style={{
          flexGrow: 1,
          background:
            "linear-gradient(235deg, rgb(255,255,255) 30%, rgb(247,161,11) 130%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          borderBottom: "1px solid white",
        }}
      >
        <h3>{title || "Kết quả tìm kiếm"}</h3>
      </div>
      <div className="container-fluid">
        <div className="row g-1 mt-2">
          {loading
            ? Array(24)
                .fill(null)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="col-6 col-md-4 col-lg-3"
                    style={{
                      borderRadius: 7,
                      overflow: "hidden",
                      backgroundColor: "transparent",
                    }}
                  >
                    <div className="skeleton-card">
                      <Skeleton
                        variant="rectangular"
                        className="skeleton-image"
                        sx={{ bgcolor: "rgb(73, 73, 73)" }}
                        animation="wave"
                        style={{ margin: 10, borderRadius: 7 }}
                      />
                      <Skeleton
                        variant="text"
                        className="skeleton-title"
                        sx={{ bgcolor: "rgb(73, 73, 73)" }}
                        animation="wave"
                        style={{ margin: 10 }}
                      />
                      <Skeleton
                        variant="text"
                        className="skeleton-subtitle"
                        sx={{ bgcolor: "rgb(73, 73, 73)" }}
                        animation="wave"
                        style={{ margin: 10 }}
                      />
                    </div>
                  </div>
                ))
            : listMovies.map((item, idx) => (
                <div key={idx} className="col-6 col-md-4 col-lg-3">
                  <Card movie={item} />
                </div>
              ))}
        </div>
      </div>
      <br />
      <PaginationRounded
        setting={pagiSetting}
        state1={{ params, setParams }}
        what={{ useWhat, setUseWhat }}
        state2={{ keyWord, setKeyWord }}
      />
    </div>
  );
}

export default ListMovies;
