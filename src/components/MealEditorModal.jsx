import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";

const emojiChoices = ["🌤", "🍚", "🥗", "🍎", "🥚", "🥛", "🍱", "🥜", "🍵", "🍽"];

export default function MealEditorModal({ open, meal, onClose, onSave }) {
  const [emoji, setEmoji] = useState("🥗");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setEmoji(meal?.emoji || "🥗");
    setTitle(meal?.title || "");
    setContent(meal?.content || "");
    window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [meal, open]);

  function submit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: meal?.id || `meal-${Date.now()}`,
      emoji,
      title: title.trim(),
      content: content.trim() || "先放进一个容易执行的选择",
      done: meal?.done || false,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={meal ? "编辑饮食项" : "添加饮食项"}
      subtitle="写一个能帮助你快速判断的内容。"
      className="meal-editor-modal"
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
          名称
          <input ref={inputRef} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：下午加餐" />
        </label>
        <label>
          内容
          <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="例如：无糖酸奶 + 一个苹果" />
        </label>
        <div className="modal-actions">
          <button type="button" className="quiet-button" onClick={onClose}>取消</button>
          <button type="submit" className="primary-button">保存饮食项</button>
        </div>
      </form>
    </Modal>
  );
}
