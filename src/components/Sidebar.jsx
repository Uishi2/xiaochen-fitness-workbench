import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Dumbbell,
  Home,
  ListChecks,
  PieChart,
  Salad,
  Settings,
  Sparkles,
  Timer,
} from "lucide-react";

export const navItems = [
  { id: "home", label: "首页", icon: Home },
  { id: "tasks", label: "今日任务", icon: ListChecks },
  { id: "plan", label: "计划", icon: CalendarDays },
  { id: "tutorials", label: "塑形教程", icon: Sparkles },
  { id: "exercises", label: "动作库", icon: Dumbbell },
  { id: "timer", label: "计时", icon: Timer },
  { id: "trainingStats", label: "训练统计", icon: ChartNoAxesColumnIncreasing },
  { id: "dietStats", label: "饮食统计", icon: PieChart },
  { id: "diet", label: "饮食", icon: Salad },
  { id: "settings", label: "设置", icon: Settings },
];

export default function Sidebar({ activeView, onNavigate, settings, stats }) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => onNavigate("home")} aria-label="返回首页">
        <span className="brand-mark">塑</span>
        <span className="brand-copy">
          <strong>塑形</strong>
          <small>女生健身工作台</small>
        </span>
      </button>

      <nav className="primary-nav" aria-label="主要导航">
        {navItems.map((item) => {
          const NavIcon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
              title={item.label}
              aria-label={item.label}
            >
              <NavIcon size={19} strokeWidth={1.8} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-spacer" />

      <section className="sidebar-stat">
        <span>连续打卡</span>
        <strong>{stats.streak}<small> 天</small></strong>
        <div className="sidebar-stat-row">
          <span>累计 {stats.trainingDays} 天</span>
          <span>{Math.round(stats.totalSeconds / 60)} 分钟</span>
        </div>
      </section>

      <div className="profile-row">
        <span className="avatar">{settings.avatar}</span>
        <span>
          <strong>{settings.nickname}</strong>
          <small>今天也向目标靠近一点</small>
        </span>
      </div>
    </aside>
  );
}
