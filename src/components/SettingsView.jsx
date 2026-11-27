import {
  Bell,
  Check,
  Download,
  HardDriveDownload,
  ShieldAlert,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { useRef, useState } from "react";
import { avatarChoices } from "../data";
import { validateBackup } from "../lib/storage";

export default function SettingsView({
  data,
  onUpdateSettings,
  onExport,
  onImport,
  onClear,
  onFeedback,
}) {
  const [importMode, setImportMode] = useState("merge");
  const fileRef = useRef(null);
  const settings = data.settings;

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!validateBackup(parsed)) {
        onFeedback("备份文件结构不完整，现有数据未被修改", "error");
        return;
      }
      onImport(parsed, importMode);
      onFeedback(importMode === "merge" ? "备份已合并" : "备份已替换");
    } catch {
      onFeedback("读取失败，请选择有效的 JSON 备份", "error");
    } finally {
      event.target.value = "";
    }
  }

  async function toggleReminder(checked) {
    if (!checked) {
      onUpdateSettings({ reminderEnabled: false });
      return;
    }
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      onUpdateSettings({
        reminderEnabled: permission === "granted",
        notificationPermission: permission,
      });
      if (permission !== "granted") onFeedback("通知未获授权，可以在浏览器设置中重新开启", "error");
      return;
    }
    const permission = "Notification" in window ? Notification.permission : "unsupported";
    onUpdateSettings({
      reminderEnabled: permission === "granted",
      notificationPermission: permission,
    });
    if (permission !== "granted") {
      onFeedback("当前浏览器未允许通知，提醒不会发送", "error");
    }
  }

  return (
    <div className="view settings-view">
      <section className="important-notice">
        <span>重要提醒</span>
        <p>所有数据存浏览器localStorage，刷新不丢；换设备、清缓存、链接失效会丢失。</p>
      </section>

      <section className="settings-section surface">
        <div className="settings-heading">
          <span className="settings-icon"><UserRound size={19} /></span>
          <div>
            <h2>个人资料</h2>
            <p>头像和昵称只保存在当前浏览器。</p>
          </div>
        </div>

        <label className="settings-field">
          昵称
          <input
            value={settings.nickname}
            onChange={(event) => onUpdateSettings({ nickname: event.target.value })}
            maxLength={18}
          />
        </label>

        <div className="avatar-setting">
          <span>emoji 头像</span>
          <div className="avatar-choices">
            {avatarChoices.map((avatar) => (
              <button
                key={avatar}
                className={settings.avatar === avatar ? "selected" : ""}
                onClick={() => onUpdateSettings({ avatar })}
                aria-label={`选择头像 ${avatar}`}
              >
                {avatar}
                {settings.avatar === avatar ? <Check size={12} /> : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section surface">
        <div className="settings-heading">
          <span className="settings-icon"><Bell size={19} /></span>
          <div>
            <h2>日常提醒</h2>
            <p>应用打开时按设定时间发送浏览器通知。</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.reminderEnabled}
              onChange={(event) => toggleReminder(event.target.checked)}
            />
            <span />
          </label>
        </div>

        <div className="settings-grid">
          <label className="settings-field">
            提醒时间
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(event) => onUpdateSettings({ reminderTime: event.target.value })}
            />
          </label>
          <label className="settings-field">
            提醒内容
            <input
              value={settings.reminderText}
              onChange={(event) => onUpdateSettings({ reminderText: event.target.value })}
            />
          </label>
        </div>
        <p className="permission-note">
          通知权限：{settings.notificationPermission === "granted" ? "已允许" : settings.notificationPermission === "denied" ? "已拒绝" : "尚未授权"}
          。浏览器只能在应用打开或安装为 PWA 后稳定提醒。
        </p>
      </section>

      <section className="settings-section surface">
        <div className="settings-heading">
          <span className="settings-icon"><HardDriveDownload size={19} /></span>
          <div>
            <h2>数据备份</h2>
            <p>导出全部任务、饮食、动作、训练和设置。</p>
          </div>
        </div>

        <div className="backup-actions">
          <button className="primary-button" onClick={onExport}>
            <Download size={16} />
            导出 JSON
          </button>
          <button className="outline-button" onClick={() => fileRef.current?.click()}>
            <Upload size={16} />
            选择备份文件
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleFile} hidden />
        </div>

        <div className="import-mode">
          <span>导入方式</span>
          <label>
            <input type="radio" name="import-mode" checked={importMode === "merge"} onChange={() => setImportMode("merge")} />
            合并现有数据
          </label>
          <label>
            <input type="radio" name="import-mode" checked={importMode === "replace"} onChange={() => setImportMode("replace")} />
            替换全部数据
          </label>
        </div>
      </section>

      <section className="danger-zone">
        <div>
          <ShieldAlert size={20} />
          <span>
            <strong>危险操作</strong>
            <small>清空当前浏览器内的全部工作台数据。</small>
          </span>
        </div>
        <button
          className="danger-button"
          onClick={() => {
            if (window.confirm("确定清空全部工作台数据吗？此操作无法撤销。")) onClear();
          }}
        >
          <Trash2 size={15} />
          清空数据
        </button>
      </section>
    </div>
  );
}
