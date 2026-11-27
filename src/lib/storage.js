import { APP_VERSION, STORAGE_KEY, buildInitialData } from "../data";

export function loadData() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildInitialData();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== APP_VERSION) return buildInitialData();
    return parsed;
  } catch {
    return buildInitialData();
  }
}

export function persistData(data) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...data, lastUpdatedAt: new Date().toISOString() }),
  );
}

export function validateBackup(value) {
  if (!value || typeof value !== "object") return false;
  if (!Number.isFinite(value.version)) return false;
  return (
    value.settings &&
    value.tasksByDate &&
    Array.isArray(value.taskEvents) &&
    Array.isArray(value.weeklyPlan) &&
    Array.isArray(value.exerciseLogs) &&
    Array.isArray(value.workoutSessions) &&
    value.dietByDate
  );
}

export function createBackup(data) {
  return {
    ...data,
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
  };
}

export function downloadBackup(data) {
  const backup = createBackup(data);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `qingran-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function mergeBackup(current, imported) {
  const taskDates = { ...current.tasksByDate };
  Object.entries(imported.tasksByDate).forEach(([key, tasks]) => {
    taskDates[key] = [...(taskDates[key] || []), ...tasks].filter(
      (task, index, list) => list.findIndex((item) => item.id === task.id) === index,
    );
  });

  const dietDates = { ...current.dietByDate };
  Object.entries(imported.dietByDate).forEach(([key, meals]) => {
    dietDates[key] = [...(dietDates[key] || []), ...meals].filter(
      (meal, index, list) => list.findIndex((item) => item.id === meal.id) === index,
    );
  });

  function mergeByKey(first, second, keyFields) {
    const map = new Map();
    [...first, ...second].forEach((item) => {
      map.set(keyFields.map((field) => item[field]).join("|"), item);
    });
    return [...map.values()];
  }

  return {
    ...current,
    settings: imported.settings,
    tasksByDate: taskDates,
    taskEvents: mergeByKey(current.taskEvents, imported.taskEvents, ["date", "taskId"]),
    weeklyPlan: mergeByKey(current.weeklyPlan, imported.weeklyPlan, ["id"]),
    tutorialProgress: { ...current.tutorialProgress, ...imported.tutorialProgress },
    exerciseLogs: mergeByKey(current.exerciseLogs, imported.exerciseLogs, ["id"]),
    workoutSessions: mergeByKey(current.workoutSessions, imported.workoutSessions, ["id"]),
    dietByDate: dietDates,
    lastUpdatedAt: new Date().toISOString(),
  };
}
