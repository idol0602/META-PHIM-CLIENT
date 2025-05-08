import { memo, useEffect, useState } from "react";

function Select({ id, name, title, data, activeItem, state, what }) {
  const [option, setOption] = useState("");
  const [disable, setDisable] = useState(false);
  const { setParams } = state;
  const { setUseWhat } = what;
  useEffect(() => {
    if (activeItem && data) {
      if (Array.isArray(activeItem.actives)) {
        const foundActive = data.find((item) =>
          activeItem.actives.includes(item.slug)
        );
        setOption(foundActive ? foundActive.slug : "");
      }
      setDisable(
        Array.isArray(activeItem.disables) && activeItem.disables.includes(id)
      );
    }
  }, [activeItem, data, id]);

  useEffect(() => {
    setUseWhat("filter");
    setParams((prevParams) => ({
      ...prevParams,
      [id]: option,
      page: 1,
    }));
  }, [option, id, setParams]);

  return (
    <div
      style={{ backgroundColor: "#333", padding: "10px", borderRadius: "8px" }}
    >
      <label
        htmlFor={id}
        style={{ color: "rgb(235, 200, 113)", marginBottom: "8px" }}
      >
        {title}
      </label>
      <select
        className="form-control"
        id={id}
        name={name}
        onChange={(e) => setOption(e.target.value)}
        value={option}
        disabled={disable}
        style={{
          backgroundColor: "#444",
          color: "white",
          border: "1px solid #555",
          borderRadius: "6px",
          padding: "5px",
          width: "100%",
          marginTop: "12px",
        }}
      >
        <option value="">Tất cả</option>
        {data.map((item) => (
          <option value={item.slug} key={item._id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default memo(Select);
