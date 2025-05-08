import { Card } from "react-bootstrap"
import { ArrowDown, ArrowUp, DollarSign, Percent, ShoppingCart, Users, Eye, Clock, BookOpen } from "lucide-react"

import styles from "../assets/css/card.module.scss"
import classNames from "classnames/bind"

export default function OverviewCard({ title, value, trend, trendUp, description, icon }) {

  const cx = classNames.bind(styles)

  const getIcon = () => {
    console.log(icon)
    switch (icon) {
      case "users":
        return <Users size={20} color="#0ea5e9" /> // màu xanh dương
      case "eye":
        return <Eye size={20} color="#10b981" /> // xanh lá
      case "clock":
        return <Clock size={20} color="#f59e0b" /> // cam
      case "book":
        return <BookOpen size={20} color="#a855f7" /> // tím
      default:
        return <Users size={20} color="#6b7280" /> // xám
    }

  }

  const trendClass = cx({
    "d-flex align-items-center rounded-pill px-2 py-1": true,
    "bg-success bg-opacity-10 text-success": trendUp,
    "bg-danger bg-opacity-10 text-danger": !trendUp,
  })

  return (
    <Card
      style={{ backgroundColor: "rgba(31, 41, 55, 0.5)", transition: "all 0.2s" }}
      className={cx("h-100 hover-card")}
    >
      <Card.Body className={cx("p-4")} style={{ border: "1px solid #374151", borderRadius: "0.5rem" }}>
        <div className={cx("d-flex align-items-center justify-content-between")}>
          <div className={cx("rounded p-2")} style={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}>
            {getIcon()}
          </div>
          <div className={trendClass} style={{ fontSize: "0.75rem" }}>
            {trendUp ? <ArrowUp size={12} className={cx("me-1")} /> : <ArrowDown size={12} className={cx("me-1")} />}
            {trend}
          </div>
        </div>
        <div className={cx("mt-3")}>
          <p className={cx("text-secondary mb-1")} style={{ fontSize: "0.875rem" }}>
            {title}
          </p>
          <h3 className={cx("text-white fs-3 fw-bold mb-1")}>{value}</h3>
          <p className={cx("text-secondary mb-0")} style={{ fontSize: "0.75rem" }}>
            {description}
          </p>
        </div>
      </Card.Body>
    </Card>
  )
}