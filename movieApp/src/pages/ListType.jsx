import Type from "../components/Types";
import { type } from "../global/Type";
import API from "../api/index";
import Card from "../components/Card";
import { useState, useEffect, useContext } from "react";
import PaginationRounded from "../components/PaginationRounded";
import Skeleton from "@mui/material/Skeleton";
import { LoadingContext } from "../global/LoadingContext";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
function ListType() {
  const location = useLocation();
  const [title, setTitle] = useState();
  const [useWhat, setUseWhat] = useState("filter");
  const [params, setParams] = useState({
    loaiPhim: "",
    theLoai: "",
    quocGia: "",
    nam: "",
    sapXep: "",
    page: 1,
  });
  const [keyWord, setKeyWord] = useState({
    key: "",
    page: 1,
  });
  const movieType = location.pathname.split("/")[2];
  const [listMovies, setListMovies] = useState([]);
  const [pagiSetting, setPagiSetting] = useState({});
  const { loading, setLoading } = useContext(LoadingContext);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      type.forEach((item) => {
        if (item.slug == movieType) {
          setTitle(item.name);
          return;
        }
      });
      const list = await API.getTypeMovies(movieType, 1);
      setPagiSetting(list[0].pagination);
      setListMovies(list);
      setParams((pre) => {
        return {
          ...pre,
          loaiPhim: movieType,
          page: 1,
        };
      });
      setLoading(false);
    }
    fetchData();
  }, [movieType]);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const parameter = {
        moviesType: params.loaiPhim,
        page: params.page,
        sortBy: params.sapXep,
        type: params.theLoai,
        nation: params.quocGia,
        year: params.nam,
      };
      const list = await API.searchMovies(parameter);
      if (list && list.length > 0) setPagiSetting(list[0].pagination);
      setListMovies(list);
      setLoading(false);
    }
    fetchData();
  }, [params]);
  return (
    <div style={{ padding: "10px 25px 0 25px" }}>
      <ToastContainer
        position="top-right" // <-- Vị trí góc trên bên phải
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Type list={type} />
      <div>
        <div
          style={{
            flexGrow: 1,
            background:
              "linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(247, 161, 11) 130%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            borderBottom: "1px solid white",
          }}
        >
          <h1>{title}</h1>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row g-1 mt-2">
          {loading
            ? Array(24)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    style={{
                      borderRadius: 7,
                      overflow: "hidden",
                      backgroundColor: "transparent",
                    }}
                    className="col-6 col-md-4 col-lg-3"
                  >
                    <div className="skeleton-card">
                      <Skeleton
                        variant="rectangular"
                        sx={{ bgcolor: "rgb(73, 73, 73)" }}
                        animation="wave"
                        style={{ margin: 10, borderRadius: 7 }}
                        className="skeleton-image"
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
            : listMovies.map((item, index) => {
                return (
                  <div key={index} className="col-6 col-md-4 col-lg-3">
                    <Card movie={item}></Card>
                  </div>
                );
              })}
        </div>
      </div>
      <br />
      <div>
        <PaginationRounded
          what={{ useWhat, setUseWhat }}
          setting={pagiSetting}
          state1={{ params, setParams }}
          state2={{ keyWord, setKeyWord }}
        ></PaginationRounded>
      </div>
    </div>
  );
}
export default ListType;
