import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";

const emojiChoices = ["💪", "🏃", "🍗", "💧", "🧘", "👟", "🔥", "🥗", "🌙", "🧘‍♀️"];

export default function TaskEditorModal({ open, task, onClose, onSave }) {
  const [emoji, setEmoji] = useState("💪");
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setEmoji(task?.emoji || "💪");
    setTitle(task?.title || "");
    setGoal(task?.goal || "");
    window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [open, task]);

  function submit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: task?.id || `task-${Date.now()}`,
      emoji,
      title: title.trim(),
      goal: goal.trim() || "按自己的节奏",
      done: task?.done || false,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "编辑今日任务" : "添加今日任务"}
      subtitle="任务尽量具体，完成后能一眼判断。"
      className="task-editor-modal"
    >
      <form onSubmit={submit} className="editor-form">
        <label>
          图标
          <span className="emoji-picker">
            {emojiChoices.map((choice) => (
              <button
                type="button"
                key={choice}
                className={emoji === choice ? "selected" : ""}
                onClick={() => setEmoji(choice)}
              >
                {choice}
              </button>
            ))}
          </span>
        </label>
        <label>
          任务名称
          <input
            ref={inputRef}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例如：晚间拉伸"
          />
        </label>
        <label>
          目标
          <input
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder="例如：10 分钟、8 杯水"
          />
        </label>
        <div className="modal-actions">
          <button type="button" className="quiet-button" onClick={onClose}>取消</button>
          <button type="submit" className="primary-button">保存任务</button>
        </div>
      </form>
    </Modal>
  );
}
