import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    if (userId) {
      navigate(`/user/${userId}`);
    } else {
      alert("Đăng nhập thất bại, không có userId.");
      navigate("/dangnhap");
    }
  }, [navigate]);

  return <p>Đang đăng nhập bằng Google, vui lòng chờ...</p>;
};

export default OAuthSuccess;
