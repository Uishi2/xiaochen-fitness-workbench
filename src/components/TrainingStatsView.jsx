import { Clock3, Dumbbell, Flame, ListChecks, Trash2, Trophy } from "lucide-react";
import { formatDuration } from "../lib/stats";

function dateLabel(key) {
  const date = new Date(`${key}T12:00:00`);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function TrainingStatsView({ data, stats, onDeleteSession }) {
  const maxMinutes = Math.max(...stats.last7.map((day) => day.minutes), 1);
  const records = [...data.workoutSessions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="view stats-view">
      <section className="stats-header">
        <div>
          <h2>你已经在积累。</h2>
          <p>统计只是回看经历，不用拿它评价今天够不够好。</p>
        </div>
        <div className="streak-emblem">
          <Flame size={24} />
          <strong>{stats.streak}</strong>
          <span>连续天数</span>
        </div>
      </section>

      <section className="metric-grid">
        {[
          { label: "累计训练天数", value: `${stats.trainingDays}`, unit: "天", icon: Trophy },
          { label: "总训练时长", value: formatDuration(stats.totalSeconds), icon: Clock3 },
          { label: "累计完成任务", value: `${stats.totalTasks}`, unit: "项", icon: ListChecks },
          { label: "累计完成动作", value: `${stats.totalExercises}`, unit: "次", icon: Dumbbell },
        ].map((item) => {
          const MetricIcon = item.icon;
          return (
            <article className="metric-card" key={item.label}>
              <MetricIcon size={18} />
              <span>{item.label}</span>
              <strong>{item.value}<small>{item.unit || ""}</small></strong>
            </article>
          );
        })}
      </section>

      <section className="surface chart-panel full-chart-panel">
        <div className="section-heading">
          <div>
            <h2>近 7 天训练</h2>
            <p>按每天保存的训练时长统计。</p>
          </div>
          <span className="chart-total">{stats.last7.reduce((sum, day) => sum + day.minutes, 0)} 分钟</span>
        </div>
        <div className="bar-chart" aria-label="最近七天训练时长柱状图">
          {stats.last7.map((day, index) => (
            <div className={`bar-column ${index === stats.last7.length - 1 ? "today" : ""}`} key={day.date}>
              <span className="bar-value">{day.minutes ? `${day.minutes}` : ""}</span>
              <span className="bar-track">
                <span style={{ height: `${day.minutes ? Math.max((day.minutes / maxMinutes) * 100, 8) : 2}%` }} />
              </span>
              <span className="bar-label">周{day.weekday}</span>
              <small>{day.label}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="surface record-panel">
        <div className="section-heading">
          <div>
            <h2>训练记录</h2>
            <p>保存过的秒表、倒计时和计划训练。</p>
          </div>
          <span className="record-count">{records.length} 条</span>
        </div>
        <div className="record-list">
          {records.map((record) => (
            <article className="record-row" key={record.id}>
              <span className="record-date">{dateLabel(record.date)}</span>
              <span className="record-name">
                <strong>{record.name}</strong>
                <small>{record.source}</small>
              </span>
              <span className="record-duration">{formatDuration(record.duration)}</span>
              <button onClick={() => onDeleteSession(record.id)} aria-label={`删除${record.name}记录`}>
                <Trash2 size={15} />
              </button>
            </article>
          ))}
          {!records.length ? (
            <div className="empty-state">
              <h3>还没有训练记录</h3>
              <p>打开计时器，完成并保存第一次训练。</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
