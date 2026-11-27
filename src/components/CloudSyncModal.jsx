import { CloudDownload, CloudUpload, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { decryptWorkbench, getCloudBackup, uploadCloudBackup } from "../lib/cloudSync";
import { validateBackup } from "../lib/storage";
import Modal from "./Modal";

export default function CloudSyncModal({ open, onClose, data, onRestore, onFeedback }) {
  const [token, setToken] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [busy, setBusy] = useState("");

  async function run(mode) {
    if (!token.trim()) {
      onFeedback("请输入 GitHub 访问令牌", "error");
      return;
    }
    if (passphrase.length < 8) {
      onFeedback("同步密码至少需要 8 个字符", "error");
      return;
    }
    setBusy(mode);
    try {
      if (mode === "upload") {
        if (!window.confirm("云端已有数据将被本次上传替换，确认继续吗？")) return;
        await uploadCloudBackup(token, data, passphrase);
        onFeedback("已加密并上传到 GitHub 云端");
      } else {
        const remote = await getCloudBackup(token);
        if (!remote) {
          onFeedback("云端还没有备份，请先上传一次", "error");
          return;
        }
        const restored = await decryptWorkbench(remote.payload, passphrase);
        if (!validateBackup(restored)) {
          onFeedback("云端备份结构不完整，未覆盖本地数据", "error");
          return;
        }
        onRestore(restored);
        onFeedback("已从云端恢复并更新本机数据");
        onClose();
      }
    } catch (error) {
      onFeedback(error.message || "云同步失败", "error");
    } finally {
      setBusy("");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="云同步"
      subtitle="数据加密后保存到你的 GitHub 仓库，不保存明文健康记录。"
      className="cloud-sync-modal"
    >
      <div className="cloud-sync-intro">
        <ShieldCheck size={22} />
        <div>
          <strong>端到端加密</strong>
          <p>令牌仅保留在当前页面内存中，不会写入源码或 localStorage。</p>
        </div>
      </div>
      <div className="cloud-fields">
        <label>
          <span><KeyRound size={14} />GitHub 访问令牌</span>
          <input
            type="password"
            autoComplete="off"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="仅需 Contents: Read and write 权限"
          />
        </label>
        <label>
          <span><LockKeyhole size={14} />同步密码</span>
          <input
            type="password"
            autoComplete="new-password"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            placeholder="至少 8 位，设备间必须一致"
          />
        </label>
      </div>
      <div className="cloud-actions">
        <button className="primary-button" onClick={() => run("upload")} disabled={Boolean(busy)}>
          <CloudUpload size={16} />
          {busy === "upload" ? "正在加密上传…" : "上传到云端"}
        </button>
        <button className="outline-button" onClick={() => run("download")} disabled={Boolean(busy)}>
          <CloudDownload size={16} />
          {busy === "download" ? "正在下载恢复…" : "从云端恢复"}
        </button>
      </div>
      <p className="cloud-sync-help">
        建议使用仅限本仓库、仅授予 Contents 读写权限的细粒度令牌。忘记同步密码后，云端备份无法解密。
      </p>
    </Modal>
  );
}
