import { ArrowRight, Egg, Salad, Sparkles } from "lucide-react";

function shortDate(key) {
  return `${Number(key.slice(5, 7))}/${Number(key.slice(8, 10))}`;
}

export default function DietStatsView({ data, stats, todayKey, onNavigate }) {
  const todayMeals = data.dietByDate[todayKey] || [];
  const doneToday = todayMeals.filter((meal) => meal.done).length;
  const maxMeals = Math.max(...stats.dietDates.map((day) => day.total), 5);

  return (
    <div className="view diet-stats-view">
      <section className="diet-stats-hero">
        <div>
          <span className="hero-signal"><Salad size={15} />饮食统计</span>
          <h2>不追求完美一餐，<br />看连续的结构。</h2>
          <p>这里的完成率和“饮食”页面使用同一份数据，勾选或编辑后会立即更新。</p>
          <button className="primary-button" onClick={() => onNavigate("diet")}>
            去记录饮食
            <ArrowRight size={15} />
          </button>
        </div>
        <div className="diet-stat-big">
          <strong>{stats.dietRate}<small>%</small></strong>
          <span>近 7 天完成率</span>
        </div>
      </section>

      <div className="diet-stats-grid">
        <section className="surface diet-week-chart">
          <div className="section-heading">
            <div>
              <h2>近 7 天饮食完成</h2>
              <p>按每天完成的饮食项计算。</p>
            </div>
            <span className="section-note"><Sparkles size={14} />实时联动</span>
          </div>
          <div className="diet-bars">
            {stats.dietDates.map((day, index) => (
              <div className={index === stats.dietDates.length - 1 ? "today" : ""} key={day.date}>
                <span className="diet-bar-value">{day.completed}/{day.total}</span>
                <span className="diet-bar-track">
                  <span style={{ height: `${day.total ? Math.max((day.completed / maxMeals) * 100, 3) : 3}%` }} />
                </span>
                <strong>{shortDate(day.date)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="surface protein-card">
          <Egg size={24} />
          <span>蛋白质完成</span>
          <strong>{stats.proteinDays}<small> 天</small></strong>
          <p>最近 7 天里，“蛋白”饮食项被勾选的天数。</p>
        </section>
      </div>

      <section className="surface today-diet-summary">
        <div className="section-heading">
          <div>
            <h2>今天的饮食</h2>
            <p>已完成 {doneToday} / {todayMeals.length} 项</p>
          </div>
          <button className="text-link" onClick={() => onNavigate("diet")}>
            管理饮食 <ArrowRight size={14} />
          </button>
        </div>
        <div className="diet-summary-list">
          {todayMeals.map((meal) => (
            <div className={meal.done ? "done" : ""} key={meal.id}>
              <span>{meal.emoji}</span>
              <strong>{meal.title}</strong>
              <small>{meal.done ? "已完成" : "待记录"}</small>
            </div>
          ))}
          {!todayMeals.length ? <p className="empty-timer">今天还没有饮食项。</p> : null}
        </div>
      </section>
    </div>
  );
}
