import { Check, Play, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { tutorials } from "../data";
import TutorialCover from "./TutorialCover";
import TutorialModal from "./TutorialModal";

export default function TutorialsView({ data, onCompleteTutorial, onFeedback }) {
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const completed = Object.values(data.tutorialProgress).filter(Boolean).length;

  return (
    <div className="view tutorials-view">
      <section className="tutorial-header">
        <div>
          <span className="hero-signal"><Sparkles size={15} />塑形训练</span>
          <h2>选一套喜欢的，<br />今天就开始。</h2>
          <p>六套新手塑形训练，按目标部位选择。也可以直接搜索小红书跟练视频。</p>
        </div>
        <div className="tutorial-completion">
          <strong>{completed}<small> / 6</small></strong>
          <span>已尝试教程</span>
        </div>
      </section>

      <div className="section-heading tutorials-heading">
        <div>
          <h2>塑形教程</h2>
          <p>动作不舒服就停止，训练要为你服务。</p>
        </div>
        <span className="section-note"><Search size={14} />支持小红书搜索</span>
      </div>

      <section className="tutorial-grid">
        {tutorials.map((tutorial) => (
          <button className="tutorial-card" key={tutorial.id} onClick={() => setSelectedTutorial(tutorial)}>
            <TutorialCover tutorial={tutorial} />
            <span className="tutorial-card-footer">
              <span>
                <strong>{tutorial.title}</strong>
                <small>{tutorial.duration} 分钟 · {tutorial.focus}</small>
              </span>
              <span className="tutorial-play">
                {data.tutorialProgress[tutorial.id] ? <Check size={16} /> : <Play size={16} fill="currentColor" />}
              </span>
            </span>
          </button>
        ))}
      </section>

      <TutorialModal
        tutorial={selectedTutorial}
        open={Boolean(selectedTutorial)}
        onClose={() => setSelectedTutorial(null)}
        completed={selectedTutorial ? Boolean(data.tutorialProgress[selectedTutorial.id]) : false}
        onComplete={(tutorial) => {
          onCompleteTutorial(tutorial.id);
          onFeedback?.("教程完成状态已更新");
        }}
        onFeedback={onFeedback}
      />
    </div>
  );
}
