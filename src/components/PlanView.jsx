import { Check, ChevronRight, Clock3, Sparkles } from "lucide-react";

export default function PlanView({
  data,
  todayKey,
  onTogglePlan,
  onNavigate,
}) {
  return (
    <div className="view plan-view">
      <section className="plan-intro">
        <div>
          <h2>一周训练分化</h2>
          <p>按照身体部位交替安排，给每一块肌肉留出恢复时间。</p>
        </div>
        <div className="plan-score">
          <strong>{data.weeklyPlan.filter((plan) => plan.completed).length}</strong>
          <span>/ 7 天已完成</span>
        </div>
      </section>

      <section className="surface week-plan-list">
        {data.weeklyPlan.map((plan) => (
          <article
            key={plan.id}
            className={`plan-row ${plan.completed ? "completed" : ""} ${plan.date === todayKey ? "today" : ""}`}
          >
            <button
              className={`plan-check ${plan.completed ? "checked" : ""}`}
              onClick={() => onTogglePlan(plan.id)}
              aria-label={plan.completed ? `取消完成${plan.title}` : `完成${plan.title}`}
            >
              {plan.completed ? <Check size={14} /> : null}
            </button>
            <span className="plan-day">
              <strong>{plan.day}</strong>
              <small>{plan.dateLabel}</small>
            </span>
            <span className="plan-topic">
              <strong>{plan.title}</strong>
              <small>{plan.focus}</small>
            </span>
            <span className="plan-time"><Clock3 size={14} />{plan.duration} 分钟</span>
            <span className="plan-state">{plan.date === todayKey ? "今天" : plan.completed ? "已完成" : "待训练"}</span>
          </article>
        ))}
      </section>

      <div className="section-heading tutorials-heading">
        <div>
          <h2>今天练哪一套？</h2>
          <p>计划是方向，真正跟练可以从一套喜欢的教程开始。</p>
        </div>
        <button className="outline-button" onClick={() => onNavigate("tutorials")}>
          <Sparkles size={15} />
          打开塑形教程
        </button>
      </div>

      <section className="week-principle">
        <span>新手周原则</span>
        <p>每周完成 3 次就已经很好。酸痛明显时改为散步和拉伸，不需要补课或惩罚自己。</p>
        <ChevronRight size={18} />
      </section>
    </div>
  );
}
