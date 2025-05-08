import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";

export default function PaginationRounded({ setting, state1, state2, what }) {
  const { params, setParams } = state1;
  const { keyWord, setKeyWord } = state2;
  const { useWhat } = what;
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(10);
  const handleChange = (event, value) => {
    setPage(value);
    if (useWhat == "filter") {
      setParams((prevParams) => ({
        ...prevParams,
        page: value,
      }));
    } else {
      setKeyWord((prevParams) => ({
        ...prevParams,
        page: value,
      }));
    }
  };
  useEffect(() => {
    if (setting && setting.totalItems && setting.totalItemsPerPage) {
      setPages(Math.ceil(setting.totalItems / setting.totalItemsPerPage));
    } else {
      setPages(1);
    }
    if (useWhat == "filter") {
      setPage(params.page);
    } else {
      setPage(keyWord.page);
    }
  }, [state1, state2]);
  return (
    <Pagination
      count={pages}
      variant="outlined"
      shape="rounded"
      size={window.innerWidth <= 700 ? "small" : "large"}
      page={page}
      onChange={handleChange}
      sx={{
        display: "flex",
        justifyContent: "center",
        "& .MuiPaginationItem-root": {
          color: "rgb(235, 200, 113)",
          borderColor: "rgb(235, 200, 113)",
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          backgroundColor: "rgb(235, 200, 113)",
          color: "black",
        },
      }}
    />
  );
}
