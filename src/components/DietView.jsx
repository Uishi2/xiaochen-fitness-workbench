import { Check, CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import MealEditorModal from "./MealEditorModal";
import PlateGuide from "./PlateGuide";

export default function DietView({
  data,
  todayKey,
  onToggleMeal,
  onSaveMeal,
  onDeleteMeal,
}) {
  const meals = data.dietByDate[todayKey] || [];
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const done = meals.filter((meal) => meal.done).length;
  const proteinDone = meals.find((meal) => meal.id === "meal-protein")?.done;

  function openEditor(meal = null) {
    setEditingMeal(meal);
    setEditorOpen(true);
  }

  return (
    <div className="view diet-view">
      <section className="diet-overview">
        <div>
          <span className="hero-signal"><CheckCircle2 size={15} />今日饮食</span>
          <h2>{done} / {meals.length} 项已完成</h2>
          <p>蛋白质{proteinDone ? "已经记录" : "还没勾选"}。下一餐先补一掌蛋白质，再考虑其他细节。</p>
        </div>
        <PlateGuide compact />
      </section>

      <div className="diet-layout">
        <section className="surface diet-list-panel">
          <div className="section-heading">
            <div>
              <h2>今天吃了什么</h2>
              <p>勾选表示完成，不代表每一餐都要完美。</p>
            </div>
            <button className="outline-button" onClick={() => openEditor()}>
              <Plus size={15} />
              添加
            </button>
          </div>

          <div className="diet-list">
            {meals.map((meal) => (
              <article className={`diet-item ${meal.done ? "done" : ""}`} key={meal.id}>
                <button
                  className={`task-checkbox ${meal.done ? "checked" : ""}`}
                  onClick={() => onToggleMeal(meal.id)}
                  aria-label={meal.done ? `取消完成${meal.title}` : `完成${meal.title}`}
                >
                  {meal.done ? <Check size={14} /> : null}
                </button>
                <span className="diet-emoji">{meal.emoji}</span>
                <span className="diet-copy">
                  <strong>{meal.title}</strong>
                  <small>{meal.content}</small>
                </span>
                <span className="task-controls">
                  <button onClick={() => openEditor(meal)} aria-label={`编辑${meal.title}`}>
                    <Pencil size={15} />
                  </button>
                  <button className="danger-hover" onClick={() => onDeleteMeal(meal.id)} aria-label={`删除${meal.title}`}>
                    <Trash2 size={15} />
                  </button>
                </span>
              </article>
            ))}
            {!meals.length ? (
              <div className="empty-state">
                <h3>今天还没有饮食项</h3>
                <p>添加早餐、午餐或一个容易执行的加餐。</p>
              </div>
            ) : null}
          </div>
        </section>

        <aside className="diet-aside">
          <section className="surface plate-panel">
            <div className="section-heading compact">
              <div>
                <h2>一餐怎么搭</h2>
                <p>手掌和餐盘就够用了。</p>
              </div>
            </div>
            <PlateGuide />
          </section>
          <section className="diet-note-card">
            <span>不用精确计算</span>
            <strong>先看蔬菜、蛋白质和主食的比例。</strong>
            <p>连续做对大部分餐，比偶尔追求一顿完美更有用。</p>
          </section>
        </aside>
      </div>

      <MealEditorModal
        open={editorOpen}
        meal={editingMeal}
        onClose={() => setEditorOpen(false)}
        onSave={(meal) => {
          onSaveMeal(meal);
          setEditorOpen(false);
        }}
      />
    </div>
  );
}
