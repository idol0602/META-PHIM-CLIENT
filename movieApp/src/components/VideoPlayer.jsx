import { useEffect, useRef } from "react";

function VideoPlayer({ width = "100%", height = "500px", link }) {
  const videoRef = useRef(null);

  const convertYouTubeLink = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}?fs=1` : url;
  };

  const embedLink = link?.includes("youtube.com/watch?v=")
    ? convertYouTubeLink(link)
    : link;

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation
            .lock("landscape")
            .catch((err) => console.warn(err));
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", margin: "auto" }}>
      {link ? (
        <div ref={videoRef} style={{ width, height }}>
          <iframe
            src={embedLink}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            title="Video Player"
          ></iframe>
        </div>
      ) : (
        <p style={{ color: "white" }}>Video không có sẵn</p>
      )}
    </div>
  );
}

export default VideoPlayer;
