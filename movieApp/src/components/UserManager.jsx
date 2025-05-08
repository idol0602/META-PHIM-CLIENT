"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaPlus, FaCog, FaInfoCircle } from "react-icons/fa";
import User from "./User";
import instanceAPI from "../global/axiosInstance";
import { toast, ToastContainer } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUser] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    instanceAPI
      .get("/getDsUser")
      .then((response) => {
        setUsers(response.data);
        setTotalUser(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleDeleteUser = (userId) => {
    instanceAPI
      .delete(`/xoaUser/${userId}`)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        toast.success("Người dùng đã được xóa.");
      })
      .catch((err) => console.error("Lỗi khi xóa:", err));
  };

  const handleUpdate = (userId) => {
    instanceAPI
      .put(`/capnhatuser/${userId}`)
      .then((res) => {
        const updatedUser = res.data;
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? updatedUser : user))
        );
        toast.success("Người dùng đã được cấp quyền.");
      })
      .catch((err) => console.error("Lỗi khi phân quyền:", err));
  };

  const totalPages = Math.ceil(totalUsers / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Cắt dữ liệu người dùng theo trang hiện tại
  const displayedUsers = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Container
      fluid
      className="rounded shadow-sm"
      style={{ backgroundColor: "rgb(20, 24, 27)", padding: "0px" }}
    >
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <h6 className="mb-0 me-2 text-white">
            All Users:{" "}
            <span className="fw-bold">{totalUsers.toLocaleString()}</span>
          </h6>
        </div>
      </div>

      <div className="table-responsive">
        <Table
          hover
          className="align-middle"
          style={{ borderCollapse: "separate", borderSpacing: "0px" }}
        >
          <thead>
            <tr style={{ backgroundColor: "rgb(30, 35, 48)" }}>
              <th>Tên tài khoản</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user) => (
              <User
                key={user._id}
                user={user}
                onDelete={handleDeleteUser}
                onUpdate={handleUpdate}
              />
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Pagination className="mb-0">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {Array.from({ length: totalPages }, (_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={currentPage === idx + 1}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      </div>
    </Container>
  );
};

export default UserManagement;
