import { useCallback, useEffect, useMemo, useState } from "react";
import DietView from "./components/DietView";
import DietStatsView from "./components/DietStatsView";
import CloudSyncModal from "./components/CloudSyncModal";
import ExerciseView from "./components/ExerciseView";
import HomeView from "./components/HomeView";
import PlanView from "./components/PlanView";
import SettingsView from "./components/SettingsView";
import Sidebar from "./components/Sidebar";
import TaskBoardView from "./components/TaskBoardView";
import TaskEditorModal from "./components/TaskEditorModal";
import TimerPage from "./components/TimerPage";
import Topbar from "./components/Topbar";
import TrainingStatsView from "./components/TrainingStatsView";
import TutorialsView from "./components/TutorialsView";
import {
  APP_VERSION,
  buildInitialData,
  createDefaultTasks,
  createDefaultMeals,
  createWeeklyPlan,
  dateKey,
  tutorials,
} from "./data";
import { getStats } from "./lib/stats";
import {
  downloadBackup,
  loadData,
  mergeBackup,
  persistData,
} from "./lib/storage";

export default function App() {
  const [data, setData] = useState(loadData);
  const [activeView, setActiveView] = useState(() => {
    const requested = window.location.hash.replace("#", "");
    return [
      "home",
      "tasks",
      "plan",
      "tutorials",
      "exercises",
      "timer",
      "trainingStats",
      "dietStats",
      "diet",
      "settings",
    ].includes(requested)
      ? requested
      : "home";
  });
  const [taskEditorOpen, setTaskEditorOpen] = useState(false);
  const [cloudSyncOpen, setCloudSyncOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [todayKey, setTodayKey] = useState(() => dateKey(new Date()));
  const stats = useMemo(() => getStats(data), [data]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => {
    const current = { ...data };
    if (!current.tasksByDate[todayKey]) {
      current.tasksByDate = { ...current.tasksByDate, [todayKey]: createDefaultTasks() };
    }
    if (!current.dietByDate[todayKey]) {
      current.dietByDate = { ...current.dietByDate, [todayKey]: createDefaultMeals() };
    }
    setData(current);
  }, [todayKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    persistData(data);
  }, [data]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextKey = dateKey(new Date());
      setTodayKey((current) => current === nextKey ? current : nextKey);
    }, 60000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", `#${activeView}`);
  }, [activeView]);

  useEffect(() => {
    if (!data.settings.reminderEnabled || !("Notification" in window)) return undefined;
    const interval = window.setInterval(() => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const reminderKey = `qingran-reminder-${todayKey}-${time}`;
      if (
        time === data.settings.reminderTime &&
        Notification.permission === "granted" &&
        !window.localStorage.getItem(reminderKey)
      ) {
        new Notification("塑形工作台提醒", { body: data.settings.reminderText });
        window.localStorage.setItem(reminderKey, "sent");
      }
    }, 30000);
    return () => window.clearInterval(interval);
  }, [data.settings.reminderEnabled, data.settings.reminderText, data.settings.reminderTime, todayKey]);

  function updateTodayTasks(updater) {
    setData((current) => ({
      ...current,
      tasksByDate: {
        ...current.tasksByDate,
        [todayKey]: updater(current.tasksByDate[todayKey] || []),
      },
    }));
  }

  function toggleTask(taskId) {
    setData((current) => {
      const tasks = current.tasksByDate[todayKey] || [];
      const task = tasks.find((item) => item.id === taskId);
      if (!task) return current;
      const willComplete = !task.done;
      const eventId = `${todayKey}-${taskId}`;
      const taskEvents = willComplete
        ? current.taskEvents.some((event) => event.id === eventId)
          ? current.taskEvents
          : [
              ...current.taskEvents,
              {
                id: eventId,
                date: todayKey,
                taskId,
                title: task.title,
                emoji: task.emoji,
              },
            ]
        : current.taskEvents.filter((event) => event.id !== eventId);
      return {
        ...current,
        taskEvents,
        tasksByDate: {
          ...current.tasksByDate,
          [todayKey]: tasks.map((item) => item.id === taskId ? { ...item, done: willComplete } : item),
        },
      };
    });
  }

  function saveTask(task) {
    setData((current) => {
      const tasks = current.tasksByDate[todayKey] || [];
      const exists = tasks.some((item) => item.id === task.id);
      return {
        ...current,
        tasksByDate: {
          ...current.tasksByDate,
          [todayKey]: exists
            ? tasks.map((item) => item.id === task.id ? task : item)
            : [...tasks, task],
        },
        taskEvents: current.taskEvents.map((event) =>
          event.date === todayKey && event.taskId === task.id
            ? { ...event, title: task.title, emoji: task.emoji }
            : event,
        ),
      };
    });
    setTaskEditorOpen(false);
    setEditingTask(null);
    showToast("任务已保存");
  }

  function deleteTask(taskId) {
    updateTodayTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    showToast("任务已删除，历史统计会保留");
  }

  function togglePlan(planId) {
    setData((current) => {
      const plan = current.weeklyPlan.find((item) => item.id === planId);
      if (!plan) return current;
      const completed = !plan.completed;
      const sessionId = `plan-session-${plan.date}`;
      return {
        ...current,
        weeklyPlan: current.weeklyPlan.map((item) =>
          item.id === planId ? { ...item, completed } : item,
        ),
        workoutSessions: completed
          ? current.workoutSessions.some((session) => session.id === sessionId)
            ? current.workoutSessions
            : [
                ...current.workoutSessions,
                {
                  id: sessionId,
                  date: plan.date,
                  name: `周计划 · ${plan.title}`,
                  duration: plan.duration * 60,
                  source: "训练计划",
                },
              ]
          : current.workoutSessions.filter((session) => session.id !== sessionId),
      };
    });
  }

  function completeTutorial(tutorialId) {
    setData((current) => {
      const completed = !current.tutorialProgress[tutorialId];
      const tutorial = tutorials.find((item) => item.id === tutorialId);
      const sessionId = `tutorial-session-${todayKey}-${tutorialId}`;
      return {
        ...current,
        tutorialProgress: {
          ...current.tutorialProgress,
          [tutorialId]: completed ? new Date().toISOString() : "",
        },
        workoutSessions: tutorial && completed
          ? current.workoutSessions.some((session) => session.id === sessionId)
            ? current.workoutSessions
            : [
                ...current.workoutSessions,
                {
                  id: sessionId,
                  date: todayKey,
                  name: tutorial.title,
                  duration: tutorial.duration * 60,
                  source: "塑形教程",
                },
              ]
          : current.workoutSessions.filter((session) => session.id !== sessionId),
      };
    });
  }

  function toggleExercise(exercise) {
    setData((current) => {
      const existing = current.exerciseLogs.find(
        (log) => log.date === todayKey && log.exerciseId === exercise.id,
      );
      return {
        ...current,
        exerciseLogs: existing
          ? current.exerciseLogs.filter((log) => log.id !== existing.id)
          : [
              ...current.exerciseLogs,
              {
                id: `exercise-${Date.now()}`,
                date: todayKey,
                exerciseId: exercise.id,
                name: exercise.name,
                category: exercise.category,
              },
            ],
      };
    });
  }

  function saveMeal(meal) {
    setData((current) => {
      const meals = current.dietByDate[todayKey] || [];
      const exists = meals.some((item) => item.id === meal.id);
      return {
        ...current,
        dietByDate: {
          ...current.dietByDate,
          [todayKey]: exists
            ? meals.map((item) => item.id === meal.id ? meal : item)
            : [...meals, meal],
        },
      };
    });
    showToast("饮食项已保存");
  }

  function deleteMeal(mealId) {
    setData((current) => ({
      ...current,
      dietByDate: {
        ...current.dietByDate,
        [todayKey]: (current.dietByDate[todayKey] || []).filter((meal) => meal.id !== mealId),
      },
    }));
    showToast("饮食项已删除");
  }

  function toggleMeal(mealId) {
    setData((current) => ({
      ...current,
      dietByDate: {
        ...current.dietByDate,
        [todayKey]: (current.dietByDate[todayKey] || []).map((meal) =>
          meal.id === mealId ? { ...meal, done: !meal.done } : meal,
        ),
      },
    }));
  }

  function updateSettings(patch) {
    setData((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }));
  }

  function importData(imported, mode) {
    setData((current) => {
      if (mode === "replace") {
        return {
          ...imported,
          version: APP_VERSION,
          tasksByDate: {
            ...imported.tasksByDate,
            [todayKey]: imported.tasksByDate[todayKey] || createDefaultTasks(),
          },
          dietByDate: {
            ...imported.dietByDate,
            [todayKey]: imported.dietByDate[todayKey] || createDefaultMeals(),
          },
        };
      }
      return mergeBackup(current, imported);
    });
  }

  function resetAll() {
    const blank = buildInitialData();
    setData({
      ...blank,
      tasksByDate: { [todayKey]: [] },
      taskEvents: [],
      workoutSessions: [],
      exerciseLogs: [],
      tutorialProgress: {},
      dietByDate: { [todayKey]: [] },
      weeklyPlan: createWeeklyPlan().map((plan) => ({ ...plan, completed: false })),
    });
    setActiveView("home");
    showToast("工作台数据已清空");
  }

  function addSession(session) {
    setData((current) => ({
      ...current,
      workoutSessions: [...current.workoutSessions, session],
    }));
    showToast("训练时长已保存");
  }

  function deleteSession(id) {
    setData((current) => ({
      ...current,
      workoutSessions: current.workoutSessions.filter((session) => session.id !== id),
    }));
    showToast("训练记录已删除");
  }

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={setActiveView} settings={data.settings} stats={stats} />
      <main className="main-shell">
        <Topbar
          activeView={activeView}
          onCloudSync={() => setCloudSyncOpen(true)}
          onAddTask={() => {
            setEditingTask(null);
            setTaskEditorOpen(true);
          }}
        />
        <div className="page-content">
          {activeView === "home" ? (
            <HomeView
              data={data}
              stats={stats}
              todayKey={todayKey}
              onNavigate={setActiveView}
            />
          ) : null}
          {activeView === "tasks" ? (
            <TaskBoardView
              data={data}
              todayKey={todayKey}
              onToggleTask={toggleTask}
              onEditTask={(task) => {
                setEditingTask(task);
                setTaskEditorOpen(true);
              }}
              onDeleteTask={deleteTask}
              onAddTask={() => {
                setEditingTask(null);
                setTaskEditorOpen(true);
              }}
            />
          ) : null}
          {activeView === "plan" ? (
            <PlanView
              data={data}
              todayKey={todayKey}
              onTogglePlan={togglePlan}
              onNavigate={setActiveView}
            />
          ) : null}
          {activeView === "tutorials" ? (
            <TutorialsView
              data={data}
              onCompleteTutorial={completeTutorial}
              onFeedback={showToast}
            />
          ) : null}
          {activeView === "exercises" ? (
            <ExerciseView data={data} todayKey={todayKey} onToggleExercise={toggleExercise} />
          ) : null}
          {activeView === "timer" ? (
            <TimerPage data={data} todayKey={todayKey} onSave={addSession} />
          ) : null}
          {activeView === "trainingStats" ? (
            <TrainingStatsView data={data} stats={stats} onDeleteSession={deleteSession} />
          ) : null}
          {activeView === "dietStats" ? (
            <DietStatsView
              data={data}
              stats={stats}
              todayKey={todayKey}
              onNavigate={setActiveView}
            />
          ) : null}
          {activeView === "diet" ? (
            <DietView
              data={data}
              todayKey={todayKey}
              onToggleMeal={toggleMeal}
              onSaveMeal={saveMeal}
              onDeleteMeal={deleteMeal}
            />
          ) : null}
          {activeView === "settings" ? (
            <SettingsView
              data={data}
              onUpdateSettings={updateSettings}
              onExport={() => downloadBackup(data)}
              onImport={importData}
              onClear={resetAll}
              onFeedback={showToast}
            />
          ) : null}
        </div>
      </main>

      <TaskEditorModal
        open={taskEditorOpen}
        task={editingTask}
        onClose={() => {
          setTaskEditorOpen(false);
          setEditingTask(null);
        }}
        onSave={saveTask}
      />
      <CloudSyncModal
        open={cloudSyncOpen}
        onClose={() => setCloudSyncOpen(false)}
        data={data}
        onRestore={(restored) => {
          setData(restored);
          setActiveView("home");
        }}
        onFeedback={showToast}
      />
      {toast ? <div className={`toast ${toast.type}`} role="status">{toast.message}</div> : null}
    </div>
  );
}
