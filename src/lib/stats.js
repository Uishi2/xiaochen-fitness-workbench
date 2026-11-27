import { addDays, dateKey } from "../data";

function uniqueDates(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function previousDateKey(key) {
  const date = new Date(`${key}T12:00:00`);
  return dateKey(addDays(date, -1));
}

export function getStats(data) {
  const taskDates = data.taskEvents.map((event) => event.date);
  const exerciseDates = data.exerciseLogs.map((log) => log.date);
  const sessionDates = data.workoutSessions.map((session) => session.date);
  const planDates = data.weeklyPlan.filter((plan) => plan.completed).map((plan) => plan.date);
  const activityDates = uniqueDates([...taskDates, ...exerciseDates, ...sessionDates, ...planDates]);
  const reverseDates = [...activityDates].reverse();

  let streak = 0;
  if (reverseDates.length) {
    let cursor = reverseDates[0];
    const dateSet = new Set(activityDates);
    while (dateSet.has(cursor)) {
      streak += 1;
      cursor = previousDateKey(cursor);
    }
  }

  const totalSeconds = data.workoutSessions.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const now = new Date();
  const last7 = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(now, index - 6);
    const key = dateKey(date);
    const seconds = data.workoutSessions
      .filter((session) => session.date === key)
      .reduce((sum, session) => sum + Number(session.duration || 0), 0);
    return {
      date: key,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      weekday: ["日", "一", "二", "三", "四", "五", "六"][date.getDay()],
      minutes: Math.round(seconds / 60),
      exercises: data.exerciseLogs.filter((log) => log.date === key).length,
    };
  });

  const dietDates = last7.map(({ date }) => {
    const meals = data.dietByDate[date] || [];
    return {
      date,
      completed: meals.filter((meal) => meal.done).length,
      total: meals.length,
    };
  });
  const dietCompleted = dietDates.reduce((sum, item) => sum + item.completed, 0);
  const dietTotal = dietDates.reduce((sum, item) => sum + item.total, 0);

  return {
    streak,
    trainingDays: activityDates.length,
    totalSeconds,
    totalTasks: data.taskEvents.length,
    totalExercises: data.exerciseLogs.length,
    last7,
    dietDates,
    dietRate: dietTotal ? Math.round((dietCompleted / dietTotal) * 100) : 0,
    proteinDays: dietDates.filter((item) => {
      const meals = data.dietByDate[item.date] || [];
      return meals.find((meal) => meal.id === "meal-protein")?.done;
    }).length,
  };
}

export function formatDuration(seconds) {
  const safe = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  if (hours) return `${hours} 小时 ${minutes} 分`;
  if (minutes) return `${minutes} 分钟`;
  return `${safe} 秒`;
}
