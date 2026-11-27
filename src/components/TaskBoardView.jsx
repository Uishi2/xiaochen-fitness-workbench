import { Check, Pencil, Plus, Sparkles, Trash2, Trophy } from "lucide-react";
import ProgressRing from "./ui/ProgressRing";

export default function TaskBoardView({
  data,
  todayKey,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
}) {
  const tasks = data.tasksByDate[todayKey] || [];
  const done = tasks.filter((task) => task.done).length;
  const nextTask = tasks.find((task) => !task.done);
  return (
    <div className="view task-board-view">
      <section className="task-hero">
        <div>
          <span className="hero-signal"><Sparkles size={15} />今日推荐</span>
          <h2>
            {nextTask
              ? `先完成 ${nextTask.emoji} ${nextTask.title}。`
              : tasks.length
                ? "今天已经全部完成。"
                : "先添加一件今天想完成的小事。"}
          </h2>
          <p>{nextTask ? `目标：${nextTask.goal}。不需要追求速度，完成就算。` : "给自己留一点空间，今天的选择已经很好。"}</p>
          <button className="primary-button" onClick={nextTask ? () => onToggleTask(nextTask.id) : onAddTask} disabled={!nextTask && !tasks.length}>
            {nextTask ? <Check size={16} /> : <Plus size={16} />}
            {nextTask ? "标记完成" : "添加任务"}
          </button>
        </div>
        <ProgressRing value={done} max={Math.max(tasks.length, 1)} label="今日完成" sublabel="项任务完成" size={150} />
      </section>

      <section className="surface full-task-panel">
        <div className="section-heading">
          <div>
            <h2>今日任务</h2>
            <p>已完成 {done} / {tasks.length} 项 · 支持编辑、删除和自定义</p>
          </div>
          <button className="outline-button" onClick={onAddTask}>
            <Plus size={15} />
            添加任务
          </button>
        </div>
        <div className="task-list">
          {tasks.map((task) => (
            <article className={`task-item ${task.done ? "is-done" : ""}`} key={task.id}>
              <button
                className={`task-checkbox ${task.done ? "checked" : ""}`}
                onClick={() => onToggleTask(task.id)}
                aria-label={task.done ? `取消完成${task.title}` : `完成${task.title}`}
              >
                {task.done ? <Check size={14} strokeWidth={2.5} /> : null}
              </button>
              <span className="task-emoji" aria-hidden="true">{task.emoji}</span>
              <span className="task-copy">
                <strong>{task.title}</strong>
                <small>{task.goal}</small>
              </span>
              <span className="task-controls">
                <button onClick={() => onEditTask(task)} aria-label={`编辑${task.title}`}>
                  <Pencil size={15} />
                </button>
                <button className="danger-hover" onClick={() => onDeleteTask(task.id)} aria-label={`删除${task.title}`}>
                  <Trash2 size={15} />
                </button>
              </span>
            </article>
          ))}
          {!tasks.length ? (
            <div className="empty-state">
              <Trophy size={24} />
              <h3>今天还没有任务</h3>
              <p>添加一项就好，明天再考虑更多。</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
