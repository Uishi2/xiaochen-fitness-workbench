export const APP_VERSION = 2;
export const STORAGE_KEY = "qingran-fitness-workbench-v2";

export function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function shortDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function weekdayCN(date) {
  return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()];
}

export function createDefaultTasks() {
  return [
    { id: "task-core", emoji: "💪", title: "核心马甲线", goal: "12 分钟", done: false },
    { id: "task-cardio", emoji: "🏃", title: "有氧", goal: "20 分钟", done: false },
    { id: "task-protein", emoji: "🍗", title: "蛋白质", goal: "一掌", done: false },
    { id: "task-water", emoji: "💧", title: "喝水", goal: "8 杯", done: false },
    { id: "task-stretch", emoji: "🧘", title: "拉伸", goal: "10 分钟", done: false },
    { id: "task-walk", emoji: "👟", title: "走路", goal: "6000 步", done: false },
  ];
}

export function createDefaultMeals() {
  return [
    { id: "meal-breakfast", emoji: "🌤", title: "早餐", content: "鸡蛋 + 豆浆 + 半根玉米", done: false },
    { id: "meal-lunch", emoji: "🍚", title: "午餐", content: "一拳主食 + 一掌肉 + 两拳蔬菜", done: false },
    { id: "meal-dinner", emoji: "🥗", title: "晚餐", content: "轻一点吃，也别忘了蛋白质", done: false },
    { id: "meal-snack", emoji: "🍎", title: "加餐", content: "水果、酸奶或牛奶", done: false },
    { id: "meal-protein", emoji: "🥚", title: "蛋白", content: "今天吃到一掌蛋白质了吗？", done: false },
  ];
}

export function createWeeklyPlan(base = new Date()) {
  const monday = addDays(base, -((base.getDay() + 6) % 7));
  const templates = [
    ["核心唤醒", "腹", 12, "tutorial-abs"],
    ["全身燃脂", "全身", 18, "tutorial-full"],
    ["肩臂线条", "肩背 · 臂", 15, "tutorial-shoulder"],
    ["臀腿塑形", "臀 · 腿", 20, "tutorial-glutes"],
    ["核心 + 有氧", "腹 · 全身", 18, "tutorial-abs"],
    ["拉伸恢复", "全身", 12, "tutorial-full"],
    ["休息或散步", "恢复", 20, ""],
  ];
  return templates.map(([title, focus, duration, tutorialId], index) => {
    const day = addDays(monday, index);
    return {
      id: `plan-${dateKey(day)}`,
      date: dateKey(day),
      day: weekdayCN(day),
      dateLabel: shortDate(day),
      title,
      focus,
      duration,
      tutorialId,
      completed: dateKey(day) < dateKey(base) && index < 4,
    };
  });
}

export const tutorials = [
  {
    id: "tutorial-abs",
    title: "核心马甲线",
    subtitle: "从稳定呼吸开始",
    duration: 12,
    level: "新手",
    focus: "腹部核心",
    theme: "lime",
    query: "新手 核心马甲线 跟练",
    moves: ["死虫式 12 次 × 2 组", "鸟狗式 10 次 × 2 组", "反向卷腹 10 次 × 2 组", "平板支撑 20 秒 × 2 组"],
  },
  {
    id: "tutorial-glutes",
    title: "蜜桃臀",
    subtitle: "臀腿发力更稳定",
    duration: 16,
    level: "新手",
    focus: "臀部 · 腿后侧",
    theme: "peach",
    query: "新手 蜜桃臀 无器械 跟练",
    moves: ["臀桥 15 次 × 2 组", "椅子深蹲 12 次 × 2 组", "侧卧抬腿 12 次 × 2 组", "站姿后踢 12 次 × 2 组"],
  },
  {
    id: "tutorial-shoulder",
    title: "直角肩",
    subtitle: "改善圆肩体态",
    duration: 10,
    level: "新手",
    focus: "肩 · 上背",
    theme: "sky",
    query: "新手 直角肩 肩背 跟练",
    moves: ["靠墙天使 10 次 × 2 组", "W 字伸展 12 次 × 2 组", "肩胛俯卧撑 10 次 × 2 组", "胸椎旋转 8 次 × 2 组"],
  },
  {
    id: "tutorial-arms",
    title: "纤细手臂",
    subtitle: "轻重量也能练",
    duration: 10,
    level: "新手",
    focus: "手臂 · 肩",
    theme: "butter",
    query: "新手 手臂塑形 跟练",
    moves: ["水瓶弯举 12 次 × 2 组", "侧平举 12 次 × 2 组", "臂屈伸 10 次 × 2 组", "墙壁俯卧撑 10 次 × 2 组"],
  },
  {
    id: "tutorial-legs",
    title: "紧致大腿",
    subtitle: "不跳跃的腿部训练",
    duration: 14,
    level: "新手",
    focus: "大腿 · 臀腿",
    theme: "lavender",
    query: "新手 大腿塑形 无跳跃 跟练",
    moves: ["椅子深蹲 12 次 × 2 组", "后撤弓步 8 次 × 2 组", "侧抬腿 12 次 × 2 组", "靠墙静蹲 20 秒 × 2 组"],
  },
  {
    id: "tutorial-full",
    title: "全身燃脂",
    subtitle: "低冲击，慢慢来",
    duration: 18,
    level: "新手",
    focus: "全身",
    theme: "orange",
    query: "新手 全身燃脂 低冲击 跟练",
    moves: ["原地踏步 1 分钟", "椅子深蹲 12 次 × 2 组", "站姿提膝 30 秒 × 2 组", "靠墙俯卧撑 10 次 × 2 组"],
  },
];

export const exercises = [
  {
    id: "abs-deadbug",
    category: "腹",
    name: "死虫式",
    reps: "12 次",
    sets: "2 组",
    tips: ["腰背轻贴地面", "手脚交替远离身体", "呼气时收紧腹部"],
    level: "入门",
  },
  {
    id: "abs-birddog",
    category: "腹",
    name: "鸟狗式",
    reps: "左右各 10 次",
    sets: "2 组",
    tips: ["四点支撑保持稳定", "对侧手脚同时伸展", "不要塌腰"],
    level: "入门",
  },
  {
    id: "abs-reverse",
    category: "腹",
    name: "反向卷腹",
    reps: "10 次",
    sets: "2 组",
    tips: ["膝盖靠近胸口", "动作慢，不用甩腿", "腰部不适时停止"],
    level: "基础",
  },
  {
    id: "abs-plank",
    category: "腹",
    name: "平板支撑",
    reps: "20 秒",
    sets: "2 组",
    tips: ["头、背、臀保持一线", "自然呼吸", "可改用跪姿"],
    level: "入门",
  },
  {
    id: "glute-bridge",
    category: "臀",
    name: "臀桥",
    reps: "15 次",
    sets: "2 组",
    tips: ["脚跟发力推地", "顶端夹紧臀部", "腰不要过度抬起"],
    level: "入门",
  },
  {
    id: "glute-squat",
    category: "臀",
    name: "椅子深蹲",
    reps: "12 次",
    sets: "2 组",
    tips: ["臀部向后找椅子", "膝盖朝脚尖方向", "起身时呼气"],
    level: "入门",
  },
  {
    id: "glute-side",
    category: "臀",
    name: "侧卧抬腿",
    reps: "左右各 12 次",
    sets: "2 组",
    tips: ["骨盆保持稳定", "脚掌朝前", "不要借腰部发力"],
    level: "入门",
  },
  {
    id: "glute-kick",
    category: "臀",
    name: "站姿后踢",
    reps: "左右各 12 次",
    sets: "2 组",
    tips: ["扶墙保持平衡", "脚跟向后上方", "动作幅度不必过大"],
    level: "入门",
  },
  {
    id: "shoulder-wall",
    category: "肩背",
    name: "靠墙天使",
    reps: "10 次",
    sets: "2 组",
    tips: ["头背臀贴墙", "手臂缓慢上下滑动", "不要耸肩"],
    level: "入门",
  },
  {
    id: "shoulder-w",
    category: "肩背",
    name: "W 字伸展",
    reps: "12 次",
    sets: "2 组",
    tips: ["肩胛骨向后收", "手肘沿着身体两侧", "保持自然呼吸"],
    level: "入门",
  },
  {
    id: "shoulder-scap",
    category: "肩背",
    name: "肩胛俯卧撑",
    reps: "10 次",
    sets: "2 组",
    tips: ["手臂保持伸直", "胸口主动下沉", "肩胛骨向中间收"],
    level: "基础",
  },
  {
    id: "shoulder-rotate",
    category: "肩背",
    name: "胸椎旋转",
    reps: "左右各 8 次",
    sets: "2 组",
    tips: ["眼睛跟随手移动", "骨盆保持稳定", "动作缓慢"],
    level: "入门",
  },
  {
    id: "arm-curl",
    category: "臂",
    name: "水瓶弯举",
    reps: "12 次",
    sets: "2 组",
    tips: ["手肘靠近身体", "下放时控制速度", "肩膀放松"],
    level: "入门",
  },
  {
    id: "arm-raise",
    category: "臂",
    name: "侧平举",
    reps: "12 次",
    sets: "2 组",
    tips: ["抬到肩高即可", "不要耸肩", "可用装满水的瓶子"],
    level: "入门",
  },
  {
    id: "arm-dip",
    category: "臂",
    name: "椅子臂屈伸",
    reps: "10 次",
    sets: "2 组",
    tips: ["手肘朝后", "靠近椅子下压", "手腕保持舒适"],
    level: "基础",
  },
  {
    id: "arm-pushup",
    category: "臂",
    name: "墙壁俯卧撑",
    reps: "10 次",
    sets: "2 组",
    tips: ["身体保持直线", "手肘自然弯曲", "脚离墙越远越难"],
    level: "入门",
  },
  {
    id: "leg-lunge",
    category: "腿",
    name: "后撤弓步",
    reps: "左右各 8 次",
    sets: "2 组",
    tips: ["步幅以稳定为准", "前膝朝脚尖", "可扶椅子"],
    level: "基础",
  },
  {
    id: "leg-wall",
    category: "腿",
    name: "靠墙静蹲",
    reps: "20 秒",
    sets: "2 组",
    tips: ["膝盖不超过脚尖太多", "背部贴墙", "不适就起身"],
    level: "入门",
  },
  {
    id: "leg-calf",
    category: "腿",
    name: "站姿提踵",
    reps: "15 次",
    sets: "2 组",
    tips: ["脚尖向前", "慢慢落下", "扶墙保持平衡"],
    level: "入门",
  },
  {
    id: "leg-march",
    category: "腿",
    name: "原地高抬腿走",
    reps: "40 秒",
    sets: "2 组",
    tips: ["保持走动感", "不用跳起", "手臂自然摆动"],
    level: "入门",
  },
];

export const exerciseCategories = ["全部", "腹", "臀", "肩背", "臂", "腿"];

export function buildInitialData(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const todayKey = dateKey(today);
  const previousDates = [-1, -2, -3, -5].map((amount) => dateKey(addDays(today, amount)));
  const tasksByDate = {};
  tasksByDate[todayKey] = createDefaultTasks().map((task, index) => ({
    ...task,
    done: index === 2 || index === 3,
  }));
  previousDates.forEach((key, dayIndex) => {
    tasksByDate[key] = createDefaultTasks().map((task, index) => ({
      ...task,
      done: index < (dayIndex === 3 ? 3 : 5),
    }));
  });

  const taskEvents = [];
  previousDates.forEach((key) => {
    tasksByDate[key].filter((task) => task.done).forEach((task, index) => {
      taskEvents.push({
        id: `event-${key}-${task.id}-${index}`,
        date: key,
        taskId: task.id,
        title: task.title,
        emoji: task.emoji,
      });
    });
  });
  taskEvents.push(
    { id: `event-${todayKey}-protein`, date: todayKey, taskId: "task-protein", title: "蛋白质", emoji: "🍗" },
    { id: `event-${todayKey}-water`, date: todayKey, taskId: "task-water", title: "喝水", emoji: "💧" },
  );

  const dietByDate = {};
  dietByDate[todayKey] = createDefaultMeals().map((meal, index) => ({
    ...meal,
    done: index < 2,
  }));
  previousDates.slice(0, 2).forEach((key, dayIndex) => {
    dietByDate[key] = createDefaultMeals().map((meal, index) => ({
      ...meal,
      done: index < (dayIndex === 0 ? 4 : 3),
    }));
  });

  return {
    version: APP_VERSION,
    settings: {
      nickname: "小陈",
      avatar: "🌱",
      reminderEnabled: false,
      reminderTime: "20:30",
      reminderText: "喝水、拉伸，看看今天完成了什么。",
      notificationPermission: "default",
    },
    tasksByDate,
    taskEvents,
    weeklyPlan: createWeeklyPlan(today),
    tutorialProgress: {},
    exerciseLogs: [
      { id: "ex-1", date: previousDates[1], exerciseId: "abs-deadbug", name: "死虫式", category: "腹" },
      { id: "ex-2", date: previousDates[1], exerciseId: "glute-bridge", name: "臀桥", category: "臀" },
      { id: "ex-3", date: previousDates[0], exerciseId: "shoulder-wall", name: "靠墙天使", category: "肩背" },
    ],
    workoutSessions: [
      { id: "session-1", date: previousDates[2], name: "核心训练", duration: 720, source: "秒表" },
      { id: "session-2", date: previousDates[0], name: "拉伸", duration: 480, source: "倒计时" },
    ],
    dietByDate,
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  };
}

export const avatarChoices = ["🌱", "🔥", "🧘", "🍑", "💪", "🫧", "🌞", "🥗"];
