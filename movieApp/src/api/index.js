import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

class API {
  getCategories() {
    return axios
      .get("https://ophim1.com/v1/api/the-loai")
      .then((response) => response.data.data.items)
      .catch((err) => {
        console.log(err);
        return [];
      });
  }
  getLinkImage(name) {
    return `https://img.ophim.live/uploads/movies/${name}`;
  }
  getInforMovies(slug) {
    return axios
      .get(`https://ophim1.com/phim/${slug}`)
      .then((response) => {
        let res = response.data.movie;
        let episodes = response.data.episodes;
        res = {
          ...res,
          episodes,
        };
        return res;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  }
  getEps(slug) {
    return axios
      .get(`https://ophim1.com/phim/${slug}`)
      .then((response) => {
        return response.data.episodes;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  }
  async findMovies(keyword, page) {
    try {
      let response = await axios.get(
        `https://ophim1.com/v1/api/tim-kiem?keyword=${keyword}&page=${page}`
      );
      let pagination = response.data.data.params.pagination;
      let items = response.data.data.items;
      let movies = await Promise.all(
        items.map(async (item) => {
          try {
            let imdbResponse = await axios.get(
              `https://ophim1.com/phim/${item.slug}`
            );
            let imdbData = imdbResponse.data.movie.tmdb.vote_average;

            return {
              imdb: imdbData,
              chap: item.episode_current,
              img: item.thumb_url,
              name: item.name,
              slug: item.slug,
              time: item.modified
                ? dayjs(item.modified.time).fromNow()
                : "Không xác định",
              originName: item.origin_name,
              lang: item.lang,
              year: item.year,
              category: item.category,
              poster_url: item.poster_url,
              quality: item.quality,
              pagination,
            };
          } catch (imdbError) {
            console.error(
              `Lỗi khi lấy dữ liệu IMDB của phim ${item.slug}:`,
              imdbError.message
            );
            return null;
          }
        })
      );

      return movies.filter((movie) => movie !== null);
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  getTypeMovies(type, page) {
    let api = `https://ophim1.com/v1/api/danh-sach/${type}?page=${page}`;
    if (type == "top_movies")
      api = `https://ophim1.com/v1/api/danh-sach/phim-moi?sort_field=tmdb.vote_average&page=${page}`;
    return axios
      .get(api)
      .then((response) => returnData(response))
      .catch((err) => {
        console.log(err);
        return [];
      });
  }
  searchMovies({ moviesType, page, sortBy, type, nation, year }) {
    return axios
      .get(
        `https://ophim1.com/v1/api/danh-sach/${moviesType}?page=${page}&sort_field=${sortBy}&category=${type}&country=${nation}&year=${year}`
      )
      .then((response) => returnData(response))
      .catch((err) => console.log(err));
  }
  getNations() {
    return axios
      .get(`https://ophim1.com/v1/api/quoc-gia`)
      .then((response) => response.data.data.items)
      .catch((err) => {
        console.log(err);
        return [];
      });
  }
  async getVideoForHomePage(number) {
    const api =
      "https://ophim1.com/v1/api/danh-sach/hoat-hinh?sort_field=tmdb.vote_average&category=vien-tuong&country=au-my";
    let dataDemo = [];
    let page = 1;

    while (dataDemo.length < number) {
      try {
        const response = await axios.get(`${api}&page=${page}`);
        const movies = response.data.data.items;

        for (const movie of movies) {
          if (dataDemo.length >= number) break;
          try {
            const movieResponse = await axios.get(
              `https://ophim1.com/phim/${movie.slug}`
            );
            const url = movieResponse.data.movie.trailer_url;
            const firstVideo = movieResponse.data.episodes[0];
            const isPrivate = await isYouTubeVideoPrivate(url);
            if (isPrivate == false) {
              const urlObj = new URL(url);
              const videoId = urlObj.searchParams.get("v");
              dataDemo.push({
                ...movieResponse.data.movie,
                videoId,
                firstVideo,
              });
            }
          } catch (err) {
            console.log(err);
          }
        }
        page++;
      } catch (err) {
        console.log(err);
        break;
      }
    }
    return dataDemo;
  }
}

async function returnData(response) {
  let pagination = response.data.data.params.pagination;
  let res = response.data.data.items.map((item) => {
    return {
      imdb: item.tmdb.vote_average,
      chap: item.episode_current,
      img: item.thumb_url,
      name: item.name,
      slug: item.slug,
      time: dayjs(item.modified.time).fromNow(),
      originName: item.origin_name,
      lang: item.lang,
      year: item.year,
      category: item.category,
      poster_url: item.poster_url,
      quality: item.quality,
      pagination,
    };
  });
  return res;
}

async function isYouTubeVideoPrivate(videoUrl) {
  try {
    if (!videoUrl || typeof videoUrl !== "string") {
      return true;
    }
    const urlObj = new URL(videoUrl);
    const videoId = urlObj.searchParams.get("v");

    if (!videoId) {
      return true;
    }

    const apiUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    const response = await fetch(apiUrl);

    if (response.ok) {
      return false;
    } else if (response.status === 403) {
      return true;
    } else if (response.status === 404) {
      return true;
    }
  } catch (err) {
    console.log(err);
    return true;
  }
}

export default new API();
