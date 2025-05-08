import MovieCarousel from "../components/MovieCarousel";
import Category from "../components/Category";
import Type from "../components/Types";
import API from "../api/index";
import { useEffect, useState, useContext } from "react";
import { LoadingContext } from "../global/LoadingContext";
import { type } from "../global/Type";
import { ToastContainer } from "react-toastify";

function Home() {
  const { setLoading } = useContext(LoadingContext);
  const [listVideosDemo, setListVideos] = useState([]);
  const [listSuggestMovies, setListSuggestMovies] = useState([]);
  const [listSeriesMovies, setListSeriesMovies] = useState([]);
  const [listSingleMovies, setListSingleMovies] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const videosDemo = await API.getVideoForHomePage(5);
      const suggestMovies = await API.getTypeMovies("top_movies", 1);
      const seriesMovies = await API.getTypeMovies("phim-bo", 1);
      const singleMovies = await API.getTypeMovies("phim-le", 1);
      setListVideos(videosDemo);
      setListSuggestMovies(suggestMovies);
      setListSeriesMovies(seriesMovies);
      setListSingleMovies(singleMovies);
      setLoading(false);
    }
    fetchData();
  }, []);
  return (
    <div>
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
      <div>
        <MovieCarousel movies={listVideosDemo} />
      </div>
      <br />
      <div style={{ padding: "0px 25px" }}>
        <Type list={type}></Type>
      </div>
      <br />
      <div>
        <div style={{ padding: "0px 25px" }}>
          <Category
            title="PHIM ĐỀ CỬ"
            list={listSuggestMovies}
            slug="top_movies"
          />
        </div>
        <br />
        <div style={{ padding: "0px 25px" }}>
          <Category
            title="PHIM LẺ MỚI CẬP NHẬT"
            list={listSingleMovies}
            slug="phim-le"
          />
        </div>
        <br />
        <div style={{ padding: "0px 25px" }}>
          <Category
            title="PHIM BỘ MỚI CẬP NHẬT"
            list={listSeriesMovies}
            slug="phim-bo"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
