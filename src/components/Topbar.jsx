import { Cloud, Plus } from "lucide-react";

const pageMeta = {
  home: ["首页", "今天完成一点，就比昨天更靠近目标。"],
  tasks: ["今日任务", "先完成最适合今天状态的一项。"],
  plan: ["训练计划", "一周训练分化，按自己的节奏完成。"],
  tutorials: ["塑形教程", "选择目标部位，开始一套新手训练。"],
  exercises: ["动作库", "动作做稳，比一次做很多更重要。"],
  timer: ["计时", "把注意力交给这一小段时间。"],
  trainingStats: ["训练统计", "看看已经积累了多少真实的行动。"],
  dietStats: ["饮食统计", "不用完美，只看有没有持续做到。"],
  diet: ["饮食记录", "先把一餐的结构搭好。"],
  settings: ["设置", "管理个人资料、提醒和数据备份。"],
};

export default function Topbar({ activeView, onAddTask, onCloudSync }) {
  const [title, subtitle] = pageMeta[activeView];
  const dateLabel = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());

  return (
    <header className="topbar">
      <div className="page-intro">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <span className="today-date">{dateLabel}</span>
        <button className="cloud-sync-button" onClick={onCloudSync}>
          <Cloud size={16} />
          云同步
        </button>
        {activeView === "tasks" ? (
          <button className="primary-button topbar-add" onClick={onAddTask}>
            <Plus size={16} />
            添加任务
          </button>
        ) : null}
      </div>
    </header>
  );
}
