import {
  ArrowRight,
  CalendarHeart,
  Check,
  Clock3,
  Flame,
  Salad,
  Sparkles,
} from "lucide-react";
import { formatDuration } from "../lib/stats";
import ProgressRing from "./ui/ProgressRing";

export default function HomeView({ data, stats, todayKey, onNavigate }) {
  const tasks = data.tasksByDate[todayKey] || [];
  const meals = data.dietByDate[todayKey] || [];
  const doneTasks = tasks.filter((task) => task.done).length;
  const doneMeals = meals.filter((meal) => meal.done).length;
  const todayPlan = data.weeklyPlan.find((plan) => plan.date === todayKey) || data.weeklyPlan[0];
  const completedTutorialCount = Object.values(data.tutorialProgress).filter(Boolean).length;

  const quickCards = [
    {
      eyebrow: "今日任务",
      title: `${doneTasks} / ${tasks.length} 已完成`,
      detail: doneTasks === tasks.length && tasks.length ? "今天已经收工" : "还有小事可以继续",
      icon: Check,
      tone: "coral",
      view: "tasks",
    },
    {
      eyebrow: "今日饮食",
      title: `${doneMeals} / ${meals.length} 项`,
      detail: "先把一餐的结构搭好",
      icon: Salad,
      tone: "mint",
      view: "diet",
    },
    {
      eyebrow: "塑形教程",
      title: `${completedTutorialCount} / 6 套`,
      detail: "选一套喜欢的开始",
      icon: Sparkles,
      tone: "violet",
      view: "tutorials",
    },
  ];

  return (
    <div className="view home-view">
      <section className="brand-hero">
        <div className="identity-row">
          <span className="profile-avatar">{data.settings.avatar}</span>
          <div>
            <span>今天也照顾好自己</span>
            <h2>Hi，{data.settings.nickname}</h2>
          </div>
          <span className="streak-badge"><Flame size={15} />连续打卡 {stats.streak} 天</span>
        </div>
        <div className="brand-hero-main">
          <div>
            <h2>一点点变好，<br />也值得被认真记录。</h2>
            <p>今天先从一项任务开始。身体的变化来自一次次普通但真实的完成。</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => onNavigate("tasks")}>
                <Check size={16} />
                去完成今日任务
              </button>
              <button className="quiet-button light" onClick={() => onNavigate("timer")}>
                <Clock3 size={16} />
                打开计时
              </button>
            </div>
          </div>
          <div className="hero-progress-wrap">
            <ProgressRing
              value={doneTasks}
              max={Math.max(tasks.length, 1)}
              label="今日完成"
              sublabel="项任务完成"
              size={164}
            />
          </div>
        </div>
        <span className="brand-orbit" aria-hidden="true" />
      </section>

      <section className="home-metrics">
        {[
          { label: "连续打卡", value: `${stats.streak} 天`, icon: "🔥" },
          { label: "累计训练", value: `${stats.trainingDays} 天`, icon: "📅" },
          { label: "累计时长", value: formatDuration(stats.totalSeconds), icon: "⏱" },
          { label: "累计任务", value: `${stats.totalTasks} 项`, icon: "✓" },
        ].map((item) => (
          <div className="home-metric" key={item.label}>
            <span>{item.icon}</span>
            <div>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
            </div>
          </div>
        ))}
      </section>

      <div className="home-dashboard">
        <section className="home-main-column">
          <div className="section-heading">
            <div>
              <h2>今天从这里继续</h2>
              <p>不用全部完成，选最想做的一件事。</p>
            </div>
          </div>
          <div className="home-action-grid">
            {quickCards.map((card) => {
              const CardIcon = card.icon;
              return (
                <button className={`home-action-card ${card.tone}`} key={card.view} onClick={() => onNavigate(card.view)}>
                  <span className="home-action-icon"><CardIcon size={20} /></span>
                  <span className="home-action-copy">
                    <small>{card.eyebrow}</small>
                    <strong>{card.title}</strong>
                    <span>{card.detail}</span>
                  </span>
                  <ArrowRight size={17} />
                </button>
              );
            })}
          </div>

          <section className="surface today-preview">
            <div className="section-heading">
              <div>
                <h2>今日任务一览</h2>
                <p>完成的任务会用薄荷绿标记。</p>
              </div>
              <button className="text-link" onClick={() => onNavigate("tasks")}>
                全部任务 <ArrowRight size={14} />
              </button>
            </div>
            <div className="compact-task-grid">
              {tasks.slice(0, 6).map((task) => (
                <div className={`compact-task ${task.done ? "done" : ""}`} key={task.id}>
                  <span>{task.emoji}</span>
                  <strong>{task.title}</strong>
                  <i>{task.done ? "完成" : task.goal}</i>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="home-side-column">
          <section className="plan-preview-card">
            <span className="card-label">今天的计划</span>
            <CalendarHeart size={23} />
            <h3>{todayPlan?.title || "轻松活动"}</h3>
            <p>{todayPlan?.focus || "全身"} · {todayPlan?.duration || 15} 分钟</p>
            <button onClick={() => onNavigate("plan")}>查看一周安排 <ArrowRight size={14} /></button>
          </section>
          <section className="encouragement-card">
            <Flame size={20} />
            <strong>连续 {stats.streak} 天</strong>
            <p>今天完成任意一项，就会继续保持记录。</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
