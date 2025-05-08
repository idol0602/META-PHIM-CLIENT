"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import axiosInstance from "../global/axiosInstance";
import "../assets/css/list-comment-module.css";

const ListComment = ({ currentUser = null, link = "default-page" }) => {
  // Sample comments data
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchComments();
  }, [link]);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(`/getListComment`, {
        params: {
          link: link,
        },
      });
      // Filter out deleted comments
      const activeComments = response.data.data.listComment.filter(
        (comment) => !comment.isDelete
      );
      setComments(activeComments);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState("");

  const handleAddComment = async (newCommentData) => {
    try {
      newCommentData.link = window.location.href;
      newCommentData.account_id = currentUser._id;
      newCommentData.username = currentUser.username;
      const res = await axiosInstance.post("/addComment", newCommentData);
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    const obj = {
      comment_id: commentId,
      content: newContent,
      username: currentUser.username,
    };
    try {
      obj.link = window.location.href;
      obj.account_id = currentUser._id;
      const res = await axiosInstance.post("/editComment", obj);
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const obj = {
      link: window.location.href,
      account_id: currentUser._id,
      comment_id: commentId,
    };
    try {
      const res = await axiosInstance.post("/deleteComment", obj);
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    handleAddComment({
      account_id: currentUser.id,
      avt: currentUser.avt,
      content: newComment.trim(),
      createdAt: new Date(),
      isDelete: false,
    });

    setNewComment("");
    setError("");
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = (commentId) => {
    if (!editContent.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    handleEditComment(commentId, editContent.trim());
    setEditingId(null);
    setEditContent("");
    setError("");
  };

  const handleDelete = (commentId) => {
    handleDeleteComment(commentId);
  };

  const formatDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  return (
    <div className="lcm-comment-system" id="comments">
      <div className="lcm-comment-container">
        <div className="lcm-comment-header">
          <h5 className="lcm-header-title">Bình luận ({comments.length})</h5>
        </div>
        <div className="lcm-comment-body">
          {error && <div className="lcm-comment-error">{error}</div>}
          {loading && (
            <div className="lcm-comment-loading">Loading comments...</div>
          )}

          {/* Comment input - only visible when logged in */}
          {currentUser && (
            <form onSubmit={handleSubmitComment} className="lcm-comment-form">
              <div className="lcm-comment-user-info">
                <div className="lcm-comment-avatar-container">
                  <img
                    src={currentUser.avt}
                    className="lcm-comment-avatar"
                    alt="User Avatar"
                  />
                </div>
                <div className="lcm-comment-username">
                  {currentUser ? currentUser.username : ""}
                </div>
              </div>
              <div className="lcm-comment-input-container">
                <textarea
                  rows={3}
                  placeholder="Hãy viết suy nghĩ của bạn"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="lcm-comment-input"
                />
              </div>
              <div className="lcm-comment-button-container">
                <button type="submit" className="lcm-comment-post-button">
                  Đăng
                </button>
              </div>
            </form>
          )}

          {/* Display comments */}
          <div className="lcm-comment-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="lcm-comment-item">
                  <div className="lcm-comment-item-content">
                    <div className="lcm-comment-avatar-container">
                      <img
                        src={comment.avt}
                        className="lcm-comment-avatar"
                        alt="User Avatar"
                      />
                    </div>
                    <div className="lcm-comment-details">
                      <div className="lcm-comment-item-header">
                        <h6 className="lcm-comment-username">
                          {comment.username}
                        </h6>
                        <small className="lcm-comment-timestamp">
                          {formatDate(comment.createdAt)}
                        </small>
                      </div>

                      {editingId === comment._id ? (
                        <div className="lcm-comment-edit-form">
                          <textarea
                            rows={2}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="lcm-comment-input"
                          />
                          <div className="lcm-comment-edit-buttons">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(comment._id)}
                              className="lcm-comment-save-button"
                            >
                              Lưu
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="lcm-comment-cancel-button"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="lcm-comment-text">{comment.content}</p>
                      )}

                      {/* Show edit/delete buttons only for the comment owner and when not editing */}
                      {currentUser &&
                        currentUser._id === comment.account_id &&
                        editingId !== comment._id && (
                          <div className="lcm-comment-actions">
                            <button
                              type="button"
                              className="lcm-comment-edit-button"
                              onClick={() => handleStartEdit(comment)}
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              className="lcm-comment-delete-button"
                              onClick={() => handleDelete(comment._id)}
                            >
                              Xóa
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="lcm-comment-empty">Chưa có bình luận nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListComment;
