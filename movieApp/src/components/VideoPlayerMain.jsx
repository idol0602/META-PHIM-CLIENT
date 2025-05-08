"use client";

import React, { useRef, useState, useEffect, useContext } from "react";
import Hls from "hls.js";
import { useLocation } from "react-router-dom";
import axiosInstance from "../global/axiosInstance";
import { LoginContext } from "../global/LoginContext";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Rewind,
  FastForward,
} from "lucide-react";

const VideoPlayerMain = React.forwardRef(function VideoPlayerMain(
  { linkVideo, movie, linkEp },
  videoRef
) {
  const { user, updateCurUser } = useContext(LoginContext);
  const location = useLocation();
  const { curTime } = location.state || {};
  const volumeBarRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [playButtonHover, setPlayButtonHover] = useState(false);
  const hlsUrl = linkVideo;

  // CSS Styles
  const styles = {
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: "black",
      borderRadius: "0.5rem",
      overflow: "hidden",
      aspectRatio: "16/9",
    },
    video: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    controlsContainer: {
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
      padding: "1rem",
      opacity: "0",
      transition: "opacity 0.3s ease",
    },
    controlsVisible: {
      opacity: "1",
    },
    progressContainer: {
      position: "relative",
      height: "0.5rem",
      marginBottom: "0.75rem",
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: "9999px",
      cursor: "pointer",
    },
    progressBar: {
      position: "absolute",
      top: "0",
      left: "0",
      height: "100%",
      background: "linear-gradient(to right, #fcd34d, #f59e0b)",
      borderRadius: "9999px",
    },
    progressThumb: {
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "0.75rem",
      height: "0.75rem",
      background: "linear-gradient(to right, #fcd34d, #f59e0b)",
      borderRadius: "9999px",
      opacity: "0",
      transition: "opacity 0.3s ease",
    },
    progressThumbVisible: {
      opacity: "1",
    },
    controlsRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    controlsGroup: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    button: {
      padding: "0.5rem",
      borderRadius: "9999px",
      color: "white",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    buttonHover: {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
    volumeSliderContainer: {
      position: "relative",
      width: "6rem",
      height: "0.25rem",
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: "9999px",
      cursor: "pointer",
    },

    volumeSliderProgress: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      borderRadius: "9999px",
      background: "linear-gradient(to right, #fcd34d, #f59e0b)",
      pointerEvents: "none",
      zIndex: 1,
    },

    volumeSliderInput: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "transparent",
      zIndex: 2,
      appearance: "none",
      outline: "none",
      margin: 0,
      padding: 0,
    },

    timeDisplay: {
      color: "white",
      fontSize: "0.875rem",
    },
    playOverlay: {
      position: "absolute",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    playButton: {
      width: "5rem",
      height: "5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "9999px",
      background: "linear-gradient(to bottom right, #fcd34d, #f59e0b, #d97706)",
      boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.3)",
      transition: "all 0.3s ease",
    },
    playButtonHover: {
      boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.5)",
      transform: "scale(1.05)",
    },
    playIcon: {
      width: "2.5rem",
      height: "2.5rem",
      fill: "white",
      color: "white",
      marginLeft: "0.25rem",
    },
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
      } else {
        console.error("HLS is not supported in this browser.");
      }

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        if (progressRef.current) {
          const progress = (video.currentTime / video.duration) * 100;
          progressRef.current.style.width = `${progress}%`;
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const handlePlay = () => {
        setIsPlaying(true);
        if (curTime) {
          video.currentTime = curTime;
        }
        //code here
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("pause", handlePause);
      video.addEventListener("play", handlePlay);
      video.addEventListener("ended", handleEnded);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [hlsUrl]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Custom styles for the video player */
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: linear-gradient(to right, #fcd34d, #f59e0b);
        cursor: pointer;
      }
      
      input[type=range]::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: linear-gradient(to right, #fcd34d, #f59e0b);
        cursor: pointer;
        border: none;
      }
      
      input[type=range]::-ms-thumb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: linear-gradient(to right, #fcd34d, #f59e0b);
        cursor: pointer;
      }
      
      /* Glowing effect for the play button */
      @keyframes glow {
        0% {
          box-shadow: 0 0 5px rgba(252, 211, 77, 0.5);
        }
        50% {
          box-shadow: 0 0 20px rgba(252, 211, 77, 0.8);
        }
        100% {
          box-shadow: 0 0 5px rgba(252, 211, 77, 0.5);
        }
      }
      
      .play-button-glow {
        animation: glow 2s infinite;
      }
      
      /* Hide native video controls */
      video::-webkit-media-controls {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      const timeContinue = video?.currentTime || 0;
      const timeTotal = video?.duration || 0;
      const percentRemain =
        timeTotal > 0 ? (timeContinue / timeTotal) * 100 : 0;
      const objWatchContinue = {
        slug: movie.slug,
        image: movie.thumb_url || movie.poster_url,
        name: movie.name,
        nameEp: location.search.match(/ep=([^&]*)/)[1],
        linkEp: linkEp,
        timeContinue: Math.floor(timeContinue),
        timeTotal: Math.floor(timeTotal),
        percentRemain: Math.round(percentRemain),
        category: movie.category,
        lang: movie.lang,
        originName: movie.origin_name,
        poster_url: movie.poster_url,
        quality: movie.quality,
        year: movie.year,
        time: movie.time,
      };
      if (timeContinue != 0) {
        axiosInstance
          .post("/addWatchContinue", objWatchContinue, {
            withCredentials: true,
          })
          .then((res) => {
            console.log("✅ Đã lưu dữ liệu xem tiếp:", res.data);
          })
          .catch((err) => {
            console.error("❌ Lỗi khi lưu dữ liệu xem tiếp:", err);
          });
      }
    };
  }, [location.search]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video.volume > 0 && !video.muted) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      if (volume === 0) {
        setVolume(1);
        video.volume = 1;
      }
      setIsMuted(false);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const skipBackward = () => {
    videoRef.current.currentTime = Math.max(
      videoRef.current.currentTime - 10,
      0
    );
  };

  const skipForward = () => {
    videoRef.current.currentTime = Math.min(
      videoRef.current.currentTime + 10,
      duration
    );
  };

  return (
    <div
      ref={containerRef}
      style={styles.container}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
    >
      <video
        ref={videoRef}
        style={styles.video}
        onClick={togglePlay}
        playsInline
      />

      {/* Custom Controls */}
      <div
        style={{
          ...styles.controlsContainer,
          ...(controlsVisible ? styles.controlsVisible : {}),
        }}
      >
        {/* Progress Bar */}
        <div style={styles.progressContainer} onClick={handleProgressClick}>
          <div ref={progressRef} style={styles.progressBar}></div>
          <div
            style={{
              ...styles.progressThumb,
              ...(controlsVisible ? styles.progressThumbVisible : {}),
              left: `${(currentTime / duration) * 100}%`,
            }}
          ></div>
        </div>

        {/* Controls */}
        <div style={styles.controlsRow}>
          <div style={styles.controlsGroup}>
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              style={styles.button}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {isPlaying ? (
                <Pause style={{ width: "1.25rem", height: "1.25rem" }} />
              ) : (
                <Play style={{ width: "1.25rem", height: "1.25rem" }} />
              )}
            </button>

            {/* Skip Backward */}
            <button
              onClick={skipBackward}
              style={styles.button}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Rewind style={{ width: "1.25rem", height: "1.25rem" }} />
            </button>

            {/* Skip Forward */}
            <button
              onClick={skipForward}
              style={styles.button}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FastForward style={{ width: "1.25rem", height: "1.25rem" }} />
            </button>

            {/* Volume Control */}
            <div style={styles.controlsGroup}>
              <button
                onClick={toggleMute}
                style={styles.button}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {isMuted ? (
                  <VolumeX style={{ width: "1.25rem", height: "1.25rem" }} />
                ) : (
                  <Volume2 style={{ width: "1.25rem", height: "1.25rem" }} />
                )}
              </button>
              {/* <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={styles.volumeSlider}
              /> */}
              <div style={styles.volumeSliderContainer}>
                <div
                  style={{
                    ...styles.volumeSliderProgress,
                    width: `${volume * 100}%`,
                  }}
                  ref={volumeBarRef}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={styles.volumeSliderInput}
                />
              </div>
            </div>

            {/* Time Display */}
            <div style={styles.timeDisplay}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            style={styles.button}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Maximize style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
        </div>
      </div>

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div style={styles.playOverlay} onClick={togglePlay}>
          <div
            style={{
              ...styles.playButton,
              ...(playButtonHover ? styles.playButtonHover : {}),
            }}
            className="play-button-glow"
            onMouseEnter={() => setPlayButtonHover(true)}
            onMouseLeave={() => setPlayButtonHover(false)}
          >
            <Play style={styles.playIcon} />
          </div>
        </div>
      )}
    </div>
  );
});

VideoPlayerMain.displayName = "VideoPlayerMain";

export default VideoPlayerMain;
