import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ColorTab({ color, data, activeItem }) {
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [slug, setSlug] = useState();
  const [activeButton, setActiveButton] = useState(activeItem);

  useEffect(() => {
    if (location.search.match(/ep=([^&]*)/)) {
      setActiveButton(location.search.match(/ep=([^&]*)/)[1]);
    }
    setSlug(location.pathname.split("/")[2]);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: { color } }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: color },
          }}
        >
          {data.map((item, index) => (
            <Tab
              key={index}
              label={item.server_name}
              {...a11yProps(index)}
              sx={{
                color: "white",
                "&.Mui-selected": { color: "rgb(235, 200, 113)" },
              }}
            />
          ))}
        </Tabs>
      </Box>
      {Array.isArray(data) &&
        data.map((item, index) => (
          <CustomTabPanel
            key={index}
            value={value}
            index={index}
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              padding: "10px",
              scrollbarColor: "rgb(40, 43, 58) rgb(20, 22, 30)",
            }}
          >
            {Array.isArray(item.server_data) &&
              item.server_data.map((i, idx) => {
                if (i.name != "")
                  return (
                    <Link
                      to={`/watch/${slug}?server=${
                        item.server_name.split("#")[1]
                      }&ep=${i.name}`}
                      key={idx}
                      style={{ textDecoration: "none" }}
                    >
                      <button
                        className="btn btn-warning"
                        onClick={() => setActiveButton(i.name)}
                        style={{
                          margin: "10px",
                          padding: "8px 10px",
                          backgroundColor:
                            activeButton === i.name
                              ? "rgb(235, 200, 113)"
                              : "rgb(40, 43, 58)",
                          border: "none",
                          color: activeButton === i.name ? "black" : "white",
                          transition: "0.3s",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          style={{
                            fill: activeButton === i.name ? "black" : "white",
                          }}
                        >
                          <path d="M7 6v12l10-6z"></path>
                        </svg>
                        {"Tập "}
                        {i.name}
                      </button>
                    </Link>
                  );
              })}
          </CustomTabPanel>
        ))}
    </Box>
  );
}

export default ColorTab;
