import { Clock3, Pause, Play, RotateCcw, Save, Square, TimerReset } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDuration } from "../lib/stats";

function formatStopwatch(milliseconds) {
  const total = Math.max(0, Math.floor(milliseconds / 10));
  const centiseconds = total % 100;
  const totalSeconds = Math.floor(total / 100);
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function formatCountdown(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function TimerPage({ data, todayKey, onSave }) {
  const [mode, setMode] = useState("stopwatch");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [countdownMinutes, setCountdownMinutes] = useState(1);
  const [name, setName] = useState("自由训练");
  const lastTick = useRef(Date.now());
  const countdownTotal = countdownMinutes * 60 * 1000;
  const remaining = Math.max(0, countdownTotal - elapsed);
  const finished = mode === "countdown" && elapsed >= countdownTotal && countdownTotal > 0;
  const seconds = Math.floor(elapsed / 1000);

  useEffect(() => {
    if (!running) return undefined;
    lastTick.current = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTick.current;
      lastTick.current = now;
      setElapsed((value) => value + delta);
    }, 80);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (finished && running) setRunning(false);
  }, [finished, running]);

  const progress = mode === "countdown"
    ? (countdownTotal ? Math.min(elapsed / countdownTotal, 1) : 0)
    : (elapsed / 1000) % 60 / 60;
  const ringStyle = useMemo(
    () => ({ "--timer-progress": `${Math.max(progress * 360, 1)}deg` }),
    [progress],
  );
  const recent = [...data.workoutSessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  function reset() {
    setRunning(false);
    setElapsed(0);
    lastTick.current = Date.now();
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    reset();
  }

  function save() {
    if (seconds < 1) return;
    onSave({
      id: `session-${Date.now()}`,
      date: todayKey,
      name: name.trim() || "自由训练",
      duration: seconds,
      source: mode === "stopwatch" ? "秒表" : "倒计时",
    });
    reset();
  }

  return (
    <div className="view timer-view">
      <section className="timer-page-hero">
        <div>
          <span className="hero-signal"><Clock3 size={15} />训练计时</span>
          <h2>把注意力，<br />交给这一小段时间。</h2>
          <p>秒表适合自由训练，倒计时适合平板支撑和间歇动作。</p>
        </div>
        <span className="timer-hero-mark"><TimerReset size={62} strokeWidth={1.2} /></span>
      </section>

      <div className="timer-page-layout">
        <section className="surface timer-workspace">
          <div className="timer-tabs">
            <button className={mode === "stopwatch" ? "active" : ""} onClick={() => switchMode("stopwatch")}>
              <Clock3 size={16} />秒表
            </button>
            <button className={mode === "countdown" ? "active" : ""} onClick={() => switchMode("countdown")}>
              <Square size={15} />倒计时
            </button>
          </div>

          <div className={`timer-page-display ${running ? "running" : ""}`} style={ringStyle}>
            <div>
              <span>{mode === "stopwatch" ? formatStopwatch(elapsed) : formatCountdown(remaining)}</span>
              <small>{finished ? "时间到了" : running ? "正在计时" : mode === "stopwatch" ? "准备好就开始" : `${countdownMinutes} 分钟倒计时`}</small>
            </div>
          </div>

          {mode === "countdown" ? (
            <div className="countdown-presets page-presets">
              {[1, 3, 5, 10].map((minutes) => (
                <button
                  key={minutes}
                  className={countdownMinutes === minutes ? "active" : ""}
                  onClick={() => {
                    setCountdownMinutes(minutes);
                    reset();
                  }}
                  disabled={running}
                >
                  {minutes} 分钟
                </button>
              ))}
            </div>
          ) : null}

          <label className="timer-name">
            训练名称
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：核心训练" />
          </label>

          <div className="timer-page-actions">
            <button className="primary-button" onClick={() => setRunning((value) => !value)} disabled={finished}>
              {running ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {running ? "暂停" : elapsed ? "继续" : "开始"}
            </button>
            <button className="quiet-button" onClick={reset}>
              <RotateCcw size={15} />重置
            </button>
            <button className="outline-button" onClick={save} disabled={seconds < 1}>
              <Save size={15} />保存本次训练
            </button>
          </div>
          <p className="timer-help">不足 1 秒的记录不会保存。保存后会进入训练统计。</p>
        </section>

        <aside className="timer-history-panel">
          <div className="section-heading compact">
            <div>
              <h2>最近计时</h2>
              <p>已保存的训练记录</p>
            </div>
          </div>
          <div className="timer-history-list">
            {recent.map((session) => (
              <div key={session.id}>
                <span>{session.name}</span>
                <strong>{formatDuration(session.duration)}</strong>
                <small>{session.date} · {session.source}</small>
              </div>
            ))}
            {!recent.length ? <p className="empty-timer">保存第一次训练后会显示在这里。</p> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
