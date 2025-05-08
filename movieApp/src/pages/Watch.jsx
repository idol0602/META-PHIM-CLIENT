import { useEffect, useState, useRef, useContext } from "react";
import ListEp from "../components/ListEp";
import ListComment from "../components/ListComment";
import { useLocation } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import VideoPlayerMain from "../components/VideoPlayerMain";
import { LoginContext } from "../global/LoginContext";
import { useNavigate, Link } from "react-router-dom";
import ShareModal from "../components/ShareModal";
import "../assets/css/watch.css";
import API from "../api/index";
function Watch() {
  const [open, setOpen] = useState(false);
  const currentUrl = window.location.href;
  const { user, updateCurUser } = useContext(LoginContext);
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const findLink = (serverNumber, episodeName, servers) => {
    const server = servers.find((s) => {
      const match = s.server_name.match(/#(\d+)/);
      return match && match[1] === String(serverNumber);
    });

    if (!server) {
      return null;
    }
    const episode = server.server_data.find(
      (e) => e.name.toLowerCase() === episodeName.toLowerCase()
    );

    if (!episode) {
      return null;
    }
    return episode.link_m3u8;
  };

  const videoRef = useRef(null);
  const isFirstLoad = useRef(true);
  const [movie, setMovie] = useState();
  const [slug, setSlug] = useState();
  const [ep, setEp] = useState();
  const [server, setSever] = useState();
  const [linkVideo, setLinkVideo] = useState();
  const [showModal, setShowModal] = useState(false);
  const [curTime, setCurTime] = useState();
  const [watchContinue, setWatchContinue] = useState();
  const query = useQuery();
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        updateCurUser();
        const data = await API.getInforMovies(location.pathname.split("/")[2]);
        setEp(query.get("ep"));
        setSever(query.get("server"));
        setSlug(location.pathname.split("/")[2]);
        setMovie(data);
        setLinkVideo(
          findLink(query.get("server"), query.get("ep"), data.episodes)
        );
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [location]);

  useEffect(() => {
    if (user && slug) {
      const filtered = user._doc.watchContinues.filter(
        (item) => item.slug == slug
      );
      if (filtered.length > 0 && filtered[0].timeContinue > 0) {
        const item = filtered[0];
        setWatchContinue({
          name: item.name,
          ep: item.nameEp,
          timeContinue: item.timeContinue,
          linkEp: item.linkEp.replace(/^.*(?=\/watch)/, ""),
        });
        setCurTime(item.timeContinue);
      } else {
        setWatchContinue(null);
      }
    }
  }, [user, slug, location]);

  // useEffect(() => {
  //   if (watchContinue) {
  //     const currentPath = window.location.pathname + window.location.search;
  //     if (isFirstLoad.current) {
  //       if (currentPath === watchContinue.linkEp) {
  //         setShowModal(false);
  //         setTimeout(() => {
  //           if (videoRef.current) {
  //             videoRef.current.currentTime = watchContinue.timeContinue;
  //           }
  //         }, 500);
  //       } else {
  //         setShowModal(true);
  //       }
  //       isFirstLoad.current = false;
  //     } else {
  //       setShowModal(false);
  //     }
  //   }
  // }, [watchContinue]);

  // useEffect(() => {
  //   if (watchContinue) {
  //     const currentPath = window.location.pathname + window.location.search;
  //     if (currentPath === watchContinue.linkEp) {
  //       setShowModal(false);
  //       setTimeout(() => {
  //         if (videoRef.current) {
  //           videoRef.current.currentTime = watchContinue.timeContinue;
  //         }
  //       }, 500);
  //     } else {
  //       setShowModal(true);
  //     }
  //   }
  // }, [slug]);

  useEffect(() => {
    if (!watchContinue) return;
    const currentPath = window.location.pathname + window.location.search;
    const shouldShowModal = currentPath !== watchContinue.linkEp;

    if (isFirstLoad.current) {
      if (!shouldShowModal && videoRef.current) {
        setTimeout(() => {
          videoRef.current.currentTime = watchContinue.timeContinue;
        }, 500);
      }
      setShowModal(shouldShowModal);
      isFirstLoad.current = false;
    }
  }, [watchContinue, slug]);

  if (!linkVideo) {
    return <LoadingOverlay isLoading={linkVideo == null}></LoadingOverlay>;
  }
  return (
    <div style={{ backgroundColor: "rgb(25, 28, 36)" }}>
      <ShareModal
        isOpen={open}
        onClose={() => setOpen(false)}
        link={currentUrl}
      />
      <div className="video-container" style={{ width: "100%" }}>
        <VideoPlayerMain
          linkVideo={linkVideo}
          ref={videoRef}
          movie={movie}
          linkEp={window.location.href}
        ></VideoPlayerMain>
      </div>
      <div style={{ padding: "0px 25px" }}>
        <br />
        <h3 style={{ color: "rgb(235, 200, 113)" }}>Tập {ep}</h3>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button className="btn btn-secondary btn-hover">
            {" Chuyển tập : "} {"off"}
          </button>
          <button
            className="btn btn-secondary btn-hover"
            onClick={() => setOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M3 12c0 1.654 1.346 3 3 3 .794 0 1.512-.315 2.049-.82l5.991 3.424c-.018.13-.04.26-.04.396 0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3c-.794 0-1.512.315-2.049.82L8.96 12.397c.018-.131.04-.261.04-.397s-.022-.266-.04-.397l5.991-3.423c.537.505 1.255.82 2.049.82 1.654 0 3-1.346 3-3s-1.346-3-3-3-3 1.346-3 3c0 .136.022.266.04.397L8.049 9.82A2.982 2.982 0 0 0 6 9c-1.654 0-3 1.346-3 3z"></path>
            </svg>
            {" Chia sẻ"}
          </button>
          <button className="btn btn-secondary btn-hover">
            <a href="#comments" style={{ all: "unset" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M20 1.999H4c-1.103 0-2 .897-2 2v18l4-4h14c1.103 0 2-.897 2-2v-12c0-1.103-.897-2-2-2zm-6 11H7v-2h7v2zm3-4H7v-2h10v2z"></path>
              </svg>
              {" Bình luận"}
            </a>
          </button>
        </div>
        <br />
        <div className="row">
          <div className="col-md-5 col-12">
            <div className="row">
              <div className="col-4">
                <Link to={`/infor/${movie.slug}`}>
                  <img src={movie.thumb_url} alt="" style={{ width: "100%" }} />
                </Link>
              </div>
              <div className="col-8">
                <h5 className="card-title" style={{ color: "white" }}>
                  {movie.name}
                </h5>
                <p
                  className="card-text"
                  style={{ color: "rgb(235, 200, 113)" }}
                >
                  {movie.origin_name}
                </p>
                <div style={{ display: "flex", marginBottom: 5 }}>
                  <span className="badge bg-secondary me-2">{movie.year}</span>
                  <span className="badge bg-secondary me-2">
                    {movie.quality}
                  </span>
                  <span className="badge bg-secondary me-2">{movie.lang}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {movie.category.map((item) => (
                    <span
                      key={item.id}
                      className="badge bg-secondary me-2 mb-2"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-7 col-12">
            <ListEp
              curEp={movie.episode_current}
              eps={movie.episodes}
              activeItem={ep}
            />
          </div>
          <div className="col-md-5"></div>
          <div className="col-md-7 col-12">
            <ListComment
              currentUser={user}
              link={window.location.href}
            ></ListComment>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <h4 style={{ color: "white" }}>
              Hệ thống đã ghi nhận bạn đang xem phim{" "}
              <span style={{ color: "rgb(235, 200, 113)" }}>
                {watchContinue.name}
              </span>
              , tập{" "}
              <span style={{ color: "rgb(235, 200, 113)" }}>
                {watchContinue.ep}
              </span>
              . Bạn có muốn xem tiếp không?
            </h4>
            <div className="modal-buttons">
              <button
                className="btn-confirm"
                onClick={() => {
                  setShowModal(false);
                  navigate(watchContinue.linkEp, {
                    state: { curTime: watchContinue.timeContinue },
                  });
                }}
              >
                Xem tiếp
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Watch;
