"use client";
import { Form, Badge, Dropdown } from "react-bootstrap";
import {
  FaFacebookF,
  FaGithub,
  FaRedditAlien,
  FaTwitter,
  FaGoogle,
  FaEllipsisV,
  FaCaretUp,
  FaCaretDown,
} from "react-icons/fa";
import Swal from "sweetalert2";
import style from "../assets/css/user-row.module.scss";
import classNames from "classnames/bind";
import instance from "../global/axiosInstance";
import { useEffect, useState } from "react";

const User = ({ user, onDelete, onUpdate }) => {
  const cx = classNames.bind(style);

  // Render icon mạng xã hội
  // const renderSocialIcon = (platform, key) => {
  //     switch (platform) {
  //         case "facebook":
  //             return <FaFacebookF key={key} className={cx("text-secondary", "mx-1")} />
  //         case "github":
  //             return <FaGithub key={key} className={cx("text-secondary", "mx-1")} />
  //         case "reddit":
  //             return <FaRedditAlien key={key} className={cx("text-secondary", "mx-1")} />
  //         case "twitter":
  //             return <FaTwitter key={key} className={cx("text-secondary", "mx-1")} />
  //         case "google":
  //             return <FaGoogle key={key} className={cx("text-secondary", "mx-1")} />
  //         default:
  //             return null
  //     }
  // }

  const handleDelete = () => {
    Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc muốn xóa người dùng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(user._id); // 🔁 gọi hàm từ cha
      }
    });
  };

  const handleUpdate = () => {
    Swal.fire({
      title: "Xác nhận cấp quyền",
      text: "Bạn có chắc cấp quyền cho người dùng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdate(user._id); // 🔁 gọi hàm từ cha
      }
    });
  };

  // Render badge vai trò
  const renderRoleBadge = (role) => {
    let bgColor = "";
    let icon = null;

    switch (role) {
      case "admin":
        bgColor = cx("bg-primary", "bg-opacity-10", "text-primary");
        icon = <i className={cx("bi", "bi-shield-lock", "me-1")}></i>;
        break;
      case "user":
        bgColor = cx("bg-purple", "bg-opacity-10", "text-purple");
        icon = <i className={cx("bi", "bi-lightning", "me-1")}></i>;
        break;

      default:
        break;
    }

    return (
      <Badge className={cx(bgColor, "border-0", "py-1", "px-2", "rounded-1")}>
        {icon} {role}
      </Badge>
    );
  };

  return (
    <tr className={cx("row-user")}>
      <td>
        <div className={cx("d-flex", "align-items-center")}>
          <img
            src={user.avt || "/placeholder.svg"}
            alt={user.username}
            className={cx("rounded-circle", "me-3")}
            width="40"
            height="40"
          />
          <span className={cx("fw-medium")}>{user.username}</span>
        </div>
      </td>
      <td>{renderRoleBadge(user.role)}</td>
      {/* <td>
        <div className={cx("d-flex", "align-items-center")}>
          {renderSocialIcon("facebook", "social-icon1")}
          {renderSocialIcon("reddit", "social-icon2")}
          {renderSocialIcon("google", "social-icon3")}
        </div>
      </td> */}
      <td>
        {new Date(user.createdAt).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </td>
      <td>
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            size="sm"
            className={cx("border-0", "bg-transparent", "text-secondary")}
          >
            <FaEllipsisV className={cx("text-secondary")} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleUpdate}>
              Cấp quyền admin
            </Dropdown.Item>
            <Dropdown.Item className={cx("text-danger")} onClick={handleDelete}>
              Xóa người dùng
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export default User;
