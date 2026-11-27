import { Check, Copy, ExternalLink, Play, Search } from "lucide-react";
import { useMemo, useState } from "react";
import Modal from "./Modal";
import TutorialCover from "./TutorialCover";

function buildSearchUrl(query) {
  return `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(query)}`;
}

function openXhs(query) {
  const webUrl = buildSearchUrl(query);
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) {
    window.location.href = `xhsdiscover://search/result?keyword=${encodeURIComponent(query)}`;
    return;
  }
  if (/android/.test(userAgent)) {
    window.location.href =
      `intent://search?keyword=${encodeURIComponent(query)}` +
      `#Intent;package=com.xingin.xhs;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
    return;
  }
  window.open(webUrl, "_blank", "noopener,noreferrer");
}

export default function TutorialModal({ tutorial, open, onClose, completed, onComplete, onFeedback }) {
  const [copied, setCopied] = useState("");
  const webUrl = useMemo(() => buildSearchUrl(tutorial?.query || ""), [tutorial]);

  if (!tutorial) return null;

  async function copyText(label, text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      onFeedback?.(label === "关键词" ? "搜索关键词已复制" : "网页链接已复制");
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      onFeedback?.("复制失败，请手动选择链接");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={tutorial.title}
      subtitle={`${tutorial.duration} 分钟 · ${tutorial.level} · ${tutorial.focus}`}
      className="tutorial-modal"
    >
      <div className="tutorial-detail-grid">
        <TutorialCover tutorial={tutorial} compact />
        <div className="tutorial-detail-copy">
          <span className="detail-label">训练动作</span>
          <div className="tutorial-moves">
            {tutorial.moves.map((move, index) => (
              <div key={move}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{move}</strong>
              </div>
            ))}
          </div>
          <p className="safety-note">动作不舒服就停下来，持续疼痛请咨询专业人士。</p>
        </div>
      </div>

      <div className="tutorial-actions">
        <button className="primary-button" onClick={() => openXhs(tutorial.query)}>
          <Search size={16} />
          搜索跟练视频
        </button>
        <a className="quiet-button link-button" href={webUrl} target="_blank" rel="noreferrer">
          <ExternalLink size={15} />
          网页回退
        </a>
        <button className="quiet-button" onClick={() => copyText("关键词", tutorial.query)}>
          {copied === "关键词" ? <Check size={15} /> : <Copy size={15} />}
          复制关键词
        </button>
        <button className="quiet-button" onClick={() => copyText("链接", webUrl)}>
          {copied === "链接" ? <Check size={15} /> : <Copy size={15} />}
          复制链接
        </button>
      </div>

      <div className="tutorial-complete-row">
        <span>搜索会尝试唤起小红书；未安装时会使用网页回退。</span>
        <button className={completed ? "outline-button success" : "outline-button"} onClick={() => onComplete?.(tutorial)}>
          {completed ? <Check size={15} /> : <Play size={15} />}
          {completed ? "已完成这套训练" : "标记完成"}
        </button>
      </div>
    </Modal>
  );
}
