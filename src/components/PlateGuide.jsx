export default function PlateGuide({ compact = false }) {
  return (
    <div className={`plate-guide ${compact ? "compact" : ""}`}>
      <div className="plate-disc" aria-label="半盘蔬菜、四分之一蛋白质、四分之一主食">
        <span className="plate-veg">蔬菜<br /><small>半盘</small></span>
        <span className="plate-protein">蛋白质<br /><small>一掌</small></span>
        <span className="plate-carb">主食<br /><small>一拳</small></span>
      </div>
      {!compact ? (
        <div className="plate-legend">
          <span><i className="legend-veg" />两拳蔬菜，先把餐盘填满</span>
          <span><i className="legend-protein" />一掌鱼、肉、蛋或豆制品</span>
          <span><i className="legend-carb" />一拳米饭、面或薯类</span>
        </div>
      ) : null}
    </div>
  );
}
