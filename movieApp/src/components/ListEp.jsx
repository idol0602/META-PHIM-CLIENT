import ColorTab from "../components/ColorTab";
function ListEp({ curEp, eps, activeItem }) {
  return (
    <div className="listEp">
      <div
        style={{
          padding: 10,
          color: "rgb(235, 200, 113)",
        }}
      >
        <h3>Danh Sách Tập Phim {curEp}</h3>
      </div>
      <div
        style={{
          padding: 10,
        }}
      >
        <ColorTab
          color="rgb(235, 200, 113)"
          data={eps}
          activeItem={activeItem}
        />
      </div>
    </div>
  );
}
export default ListEp;
