import { Check, ChevronDown, Dumbbell, History, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { exerciseCategories, exercises } from "../data";

export default function ExerciseView({ data, todayKey, onToggleExercise }) {
  const [category, setCategory] = useState("全部");
  const [expanded, setExpanded] = useState("");
  const filtered = useMemo(
    () => exercises.filter((exercise) => category === "全部" || exercise.category === category),
    [category],
  );

  return (
    <div className="view exercises-view">
      <section className="library-header">
        <div>
          <h2>按部位找到合适的动作</h2>
          <p>次数和组数只是起点。动作稳定、呼吸自然，再考虑增加难度。</p>
        </div>
        <span className="library-count"><Dumbbell size={18} />{data.exerciseLogs.length} 个动作已完成</span>
      </section>

      <div className="category-tabs" role="tablist" aria-label="动作分类">
        {exerciseCategories.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={category === item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="exercise-grid">
        {filtered.map((exercise) => {
          const isDone = data.exerciseLogs.some(
            (log) => log.date === todayKey && log.exerciseId === exercise.id,
          );
          const totalCount = data.exerciseLogs.filter((log) => log.exerciseId === exercise.id).length;
          const isExpanded = expanded === exercise.id;
          return (
            <article className={`exercise-card ${isDone ? "completed" : ""}`} key={exercise.id}>
              <div className="exercise-topline">
                <span className="exercise-category">{exercise.category}</span>
                <span className="exercise-level">{exercise.level}</span>
                {totalCount ? <span className="exercise-history"><History size={12} />完成 {totalCount} 次</span> : null}
              </div>
              <h3>{exercise.name}</h3>
              <div className="exercise-numbers">
                <span><strong>{exercise.reps}</strong>次数</span>
                <span><strong>{exercise.sets}</strong>组数</span>
              </div>
              <button
                className="exercise-expand"
                aria-expanded={isExpanded}
                onClick={() => setExpanded(isExpanded ? "" : exercise.id)}
              >
                动作要点
                <ChevronDown size={15} className={isExpanded ? "rotated" : ""} />
              </button>
              {isExpanded ? (
                <ul className="exercise-tips">
                  {exercise.tips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              ) : null}
              <button
                className={isDone ? "exercise-complete done" : "exercise-complete"}
                onClick={() => onToggleExercise(exercise)}
              >
                {isDone ? <Check size={16} /> : null}
                {isDone ? "今天已完成" : "完成这个动作"}
              </button>
            </article>
          );
        })}
      </section>

      <section className="safety-banner">
        <ShieldCheck size={21} />
        <div>
          <strong>动作舒服比看起来标准更重要。</strong>
          <p>如果出现明显疼痛、眩晕或不适，请停止训练。持续不适时咨询医生或专业教练。</p>
        </div>
      </section>
    </div>
  );
}
