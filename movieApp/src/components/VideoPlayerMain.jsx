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
  const controlsHideTimeout = useRef(null); // Ref for the timeout to hide controls
  const isPlaying = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false); // State to control visibility of controls
  const [playButtonHover, setPlayButtonHover] = useState(false);
  const hlsUrl = linkVideo;

  // CSS Styles (Inline styles are kept for demonstration, consider using a CSS module or styled-components for larger projects)
  const styles = {
    container: {
      position: "relative",
      width: "100%",
      height: "100%",
      backgroundColor: "black",
      borderRadius: "0.5rem",
      overflow: "hidden",
      aspectRatio: "16/9", // Ensures video player maintains 16:9 aspect ratio
    },
    video: {
      width: "100%",
      height: "100%",
      objectFit: "contain", // Ensures video fits within the container without cropping
    },
    controlsContainer: {
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
      padding: "2%", // Relative padding for responsiveness
      opacity: "0", // Default hidden state
      transition: "opacity 0.3s ease", // Smooth transition for showing/hiding controls
      zIndex: "10",
    },
    controlsVisible: {
      opacity: "1", // Visible state
    },
    progressContainer: {
      position: "relative",
      height: "4%", // Relative height for responsiveness
      minHeight: "4px", // Minimum height for smaller screens
      marginBottom: "2%", // Relative margin
      backgroundColor: "rgba(255,255,255,0.3)", // Background of the progress bar track
      borderRadius: "9999px", // Fully rounded corners
      cursor: "pointer",
    },
    progressBar: {
      position: "absolute",
      top: "0",
      left: "0",
      height: "100%",
      background: "linear-gradient(to right, #fcd34d, #f59e0b)", // Gradient for the filled part
      borderRadius: "9999px",
    },
    progressThumb: {
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "8px",
      height: "8px",
      background: "linear-gradient(to right, #fcd34d, #f59e0b)",
      borderRadius: "9999px",
      opacity: "0", // Default hidden
      transition: "opacity 0.3s ease", // Smooth transition
    },
    progressThumbVisible: {
      opacity: "1", // Visible state
    },
    controlsRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    controlsGroup: {
      display: "flex",
      alignItems: "center",
      gap: "2%", // Relative gap between control elements
    },
    button: {
      padding: "1%", // Relative padding
      minWidth: "24px",
      minHeight: "24px",
      borderRadius: "9999px",
      color: "white",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease", // Smooth hover effect
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonHover: {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
    volumeSliderContainer: {
      position: "relative",
      width: "10%", // Relative width
      minWidth: "60px", // Minimum width for usability
      height: "4px",
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
      pointerEvents: "none", // Ensures clicks go through to the input range
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
      appearance: "none", // Hide default browser styling
      outline: "none",
      margin: 0,
      padding: 0,
    },
    timeDisplay: {
      color: "white",
      fontSize: "min(2.5vw, 0.875rem)", // Responsive font size
      whiteSpace: "nowrap",
      marginLeft: "2%", // Relative margin
    },
    playOverlay: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: "5",
    },
    playButton: {
      width: "min(15%, 5rem)", // Responsive width
      height: "min(15%, 5rem)", // Responsive height
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
      width: "50%", // Relative to button size
      height: "50%", // Relative to button size
      fill: "white",
      color: "white",
      marginLeft: "5%", // To center the play icon optically
    },
  };

  // Helper function to format time (e.g., 1:05 -> 01:05)
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Function to reset the controls auto-hide timeout
  const resetControlsHideTimeout = () => {
    clearTimeout(controlsHideTimeout.current);
    if (isPlaying.current) {
      // Only set a new timeout if the video is currently playing
      controlsHideTimeout.current = setTimeout(() => {
        setControlsVisible(false); // Hide controls after 2 seconds
      }, 2000); // 2000ms = 2 seconds
    }
  };

  const setIsPlaying = (bool) => {
    isPlaying.current = bool;
  };

  // Effect for HLS video loading and event listeners
  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Check for native HLS support (Safari)
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
      } else if (Hls.isSupported()) {
        // Check for Hls.js support
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
      } else {
        console.error("HLS is not supported in this browser.");
      }

      // Event listener for time updates (used to update progress bar and reset hide timer)
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        if (progressRef.current) {
          const progress = (video.currentTime / video.duration) * 100;
          progressRef.current.style.width = `${progress}%`;
        }
        //resetControlsHideTimeout(); // Reset timeout on activity (time update)
      };

      // Event listener for when video metadata is loaded (to get duration)
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      // Event listener for when video is paused
      const handlePause = () => {
        setIsPlaying(false);
        setControlsVisible(true); // Show controls when paused
        clearTimeout(controlsHideTimeout.current); // Clear auto-hide timeout when paused
      };

      // Event listener for when video starts playing
      const handlePlay = () => {
        setIsPlaying(true);
        // Set current time if provided from location state and video hasn't started yet
        if (curTime && video.currentTime === 0) {
          video.currentTime = curTime;
        }
        resetControlsHideTimeout(); // Start auto-hide timeout when playing
      };

      // Event listener for when video ends
      const handleEnded = () => {
        setIsPlaying(false);
        setControlsVisible(true); // Show controls when video ends
        clearTimeout(controlsHideTimeout.current); // Clear auto-hide timeout
      };

      // Attach event listeners
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("pause", handlePause);
      video.addEventListener("play", handlePlay);
      video.addEventListener("ended", handleEnded);

      // Clean up event listeners on component unmount
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [hlsUrl, curTime]); // Dependencies: re-run if hlsUrl or curTime changes

  // Effect for injecting custom CSS styles for range inputs and animations
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
      
      /* Responsive controls */
      @media (max-width: 480px) {
        .video-controls .controls-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        
        .video-controls .controls-group {
          width: 100%;
          justify-content: space-between;
        }
        
        .video-controls .time-display {
          margin-left: auto;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Effect for saving watch continue data when the component unmounts
  useEffect(() => {
    // This effect runs on component unmount (return function)
    return () => {
      const video = videoRef.current;
      const timeContinue = video?.currentTime || 0;
      const timeTotal = video?.duration || 0;
      const percentRemain =
        timeTotal > 0 ? (timeContinue / timeTotal) * 100 : 0;

      // Extract nameEp safely from location.search
      const epMatch = location.search.match(/ep=([^&]*)/);
      const nameEp = epMatch ? epMatch[1] : null;

      const objWatchContinue = {
        slug: movie.slug,
        image: movie.thumb_url || movie.poster_url,
        name: movie.name,
        nameEp: nameEp, // Use the extracted nameEp
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

      // Only save if timeContinue is not 0 and nameEp exists
      if (timeContinue !== 0 && nameEp) {
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
  }, [location.search, movie, linkEp]); // Dependencies for this effect

  // Toggles play/pause state of the video
  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  // Handles volume change from the slider
  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
    resetControlsHideTimeout(); // Reset timer when changing volume
  };

  // Toggles mute state
  const toggleMute = () => {
    const video = videoRef.current;
    if (video.volume > 0 && !video.muted) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      if (volume === 0) {
        // If previously muted at volume 0, set to 1
        setVolume(1);
        video.volume = 1;
      }
      setIsMuted(false);
    }
    resetControlsHideTimeout(); // Reset timer when muting/unmuting
  };

  // Handles clicking on the progress bar to seek
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width; // Calculate click position relative to bar
    videoRef.current.currentTime = pos * duration; // Set video current time
    resetControlsHideTimeout(); // Reset timer on progress click
  };

  // Toggles fullscreen mode
  const toggleFullscreen = () => {
    const container = containerRef.current;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        /* Safari */
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        /* IE11 */
        container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
    resetControlsHideTimeout(); // Reset timer on fullscreen toggle
  };

  // Skips video backward by 10 seconds
  const skipBackward = () => {
    videoRef.current.currentTime = Math.max(
      videoRef.current.currentTime - 10,
      0
    );
    resetControlsHideTimeout(); // Reset timer on skip
  };

  // Skips video forward by 10 seconds
  const skipForward = () => {
    videoRef.current.currentTime = Math.min(
      videoRef.current.currentTime + 10,
      duration
    );
    resetControlsHideTimeout(); // Reset timer on skip
  };

  return (
    <div
      ref={containerRef}
      style={styles.container}
      onMouseEnter={() => {
        // When mouse enters container, show controls and reset timer
        setControlsVisible(true);
        resetControlsHideTimeout();
      }}
      onMouseMove={() => {
        // When mouse moves in container, show controls and reset timer
        setControlsVisible(true);
        resetControlsHideTimeout();
      }}
      onMouseLeave={() => {
        // When mouse leaves container, start hiding controls
        if (isPlaying.current) {
          // Only hide if the video is currently playing
          controlsHideTimeout.current = setTimeout(() => {
            setControlsVisible(false);
          }, 500); // Small delay (e.g., 500ms) to prevent controls from hiding too quickly
        }
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        style={styles.video}
        onClick={togglePlay} // Toggle play/pause on video click
        playsInline // Required for autoplay on some mobile browsers
      />

      {/* Custom Controls Container */}
      <div
        className="video-controls"
        style={{
          ...styles.controlsContainer,
          // Conditionally apply controlsVisible style based on state
          ...(controlsVisible ? styles.controlsVisible : {}),
        }}
      >
        {/* Progress Bar Container */}
        <div style={styles.progressContainer} onClick={handleProgressClick}>
          <div ref={progressRef} style={styles.progressBar}></div>
          <div
            style={{
              ...styles.progressThumb,
              // Show thumb only when controls are visible
              ...(controlsVisible ? styles.progressThumbVisible : {}),
              left: `${(currentTime / duration) * 100}%`, // Position thumb based on current time
            }}
          ></div>
        </div>

        {/* Controls Row */}
        <div style={styles.controlsRow} className="controls-row">
          {/* Left-aligned controls group */}
          <div style={styles.controlsGroup} className="controls-group">
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
              {isPlaying.current ? (
                <Pause
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "20px",
                    maxHeight: "20px",
                  }}
                />
              ) : (
                <Play
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "20px",
                    maxHeight: "20px",
                  }}
                />
              )}
            </button>

            {/* Skip Backward Button */}
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
              <Rewind
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "20px",
                  maxHeight: "20px",
                }}
              />
            </button>

            {/* Skip Forward Button */}
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
              <FastForward
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "20px",
                  maxHeight: "20px",
                }}
              />
            </button>

            {/* Volume Control Group */}
            <div style={styles.controlsGroup}>
              {/* Mute/Unmute Button */}
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
                  <VolumeX
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "20px",
                      maxHeight: "20px",
                    }}
                  />
                ) : (
                  <Volume2
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "20px",
                      maxHeight: "20px",
                    }}
                  />
                )}
              </button>
              {/* Volume Slider */}
              <div style={styles.volumeSliderContainer}>
                <div
                  style={{
                    ...styles.volumeSliderProgress,
                    width: `${volume * 100}%`, // Fill based on current volume
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
            <div style={styles.timeDisplay} className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Fullscreen Button (Right-aligned) */}
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
            <Maximize
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "20px",
                maxHeight: "20px",
              }}
            />
          </button>
        </div>
      </div>

      {/* Play/Pause Overlay (Visible when video is paused) */}
      {!isPlaying.current && (
        <div style={styles.playOverlay} onClick={togglePlay}>
          <div
            style={{
              ...styles.playButton,
              // Apply hover style if play button is hovered
              ...(playButtonHover ? styles.playButtonHover : {}),
            }}
            className="play-button-glow" // Class for glowing animation
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

VideoPlayerMain.displayName = "VideoPlayerMain"; // Good practice for debugging

export default VideoPlayerMain;
