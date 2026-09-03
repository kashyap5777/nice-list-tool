import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

const STORAGE_KEY = "sundial-tasks";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sundial — Golden-hour to-do list" },
      {
        name: "description",
        content:
          "A simple, beautiful to-do list that saves your tasks in the browser. Add, complete, and delete tasks with a warm golden-hour design.",
      },
      { property: "og:title", content: "Sundial — Golden-hour to-do list" },
      {
        property: "og:description",
        content:
          "A simple, beautiful to-do list that saves your tasks in the browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Task[];
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch {
      // Ignore malformed localStorage data.
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setInput("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const remainingCount = tasks.length - completedCount;

  return (
    <div
      className="min-h-screen w-full font-sans text-cocoa antialiased"
      style={{
        background:
          "radial-gradient(120% 120% at 82% -12%, #FDEBCD 0%, #FBEBD0 32%, #F4D9AE 64%, #EFCF9E 100%)",
      }}
    >
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
        <div className="animate-fade-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-amber text-cream shadow-[0_10px_24px_-10px_rgba(197,106,42,0.9)] font-display">
                <span className="text-lg font-semibold">S</span>
              </div>
              <div>
                <p className="font-display text-base font-semibold leading-none">
                  Sundial
                </p>
                <p className="mt-1 text-xs text-taupe">Evening tasks</p>
              </div>
            </div>
            <div className="rounded-full bg-white/60 px-4 py-1.5 text-xs font-medium text-ember shadow-sm ring-1 ring-white/70">
              {tasks.length === 0
                ? "No tasks yet"
                : `${completedCount} of ${tasks.length} done`}
            </div>
          </div>

          <h1 className="mt-8 font-display text-4xl font-medium leading-[1.05] sm:text-5xl">
            Make the most of golden hour
          </h1>
          <p className="mt-3 max-w-md text-sm text-taupe">
            A quiet little list for the hours the light is soft. Add what
            matters, cross it off, and let the rest go.
          </p>
        </div>

        <form
          onSubmit={handleAdd}
          className="animate-fade-up animation-delay-100 mt-8 rounded-3xl bg-white/70 p-4 shadow-[0_24px_50px_-30px_rgba(74,50,32,0.6)] ring-1 ring-white/70 backdrop-blur-sm sm:p-5"
        >
          <label htmlFor="task-input" className="sr-only">
            New task
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="task-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a task — e.g. Water the monstera"
              className="w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-sm text-cocoa placeholder:text-taupe/70 focus:border-honey focus:outline-none focus:ring-2 focus:ring-honey/40"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 rounded-2xl bg-amber px-6 py-3 text-sm font-semibold text-cream shadow-[0_12px_26px_-12px_rgba(197,106,42,1)] transition hover:bg-ember disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add task
            </button>
          </div>
        </form>

        <ul className="animate-fade-up animation-delay-200 mt-6 space-y-3">
          {tasks.length === 0 ? (
            <li className="rounded-2xl bg-white/50 p-8 text-center ring-1 ring-white/50">
              <p className="text-sm font-medium text-cocoa">No tasks yet</p>
              <p className="mt-1 text-xs text-taupe">
                Add one above and it will be saved in your browser.
              </p>
            </li>
          ) : (
            tasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-4 rounded-2xl bg-white/70 p-4 shadow-[0_16px_34px_-26px_rgba(74,50,32,0.5)] ring-1 ring-white/70 transition hover:bg-white/80"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? "Mark incomplete" : "Mark done"}
                  className={`grid size-6 shrink-0 place-items-center rounded-full transition ${
                    task.completed
                      ? "bg-amber text-cream shadow-[0_8px_16px_-8px_rgba(197,106,42,1)]"
                      : "ring-1 ring-sand hover:ring-honey"
                  }`}
                >
                  {task.completed && (
                    <span className="text-xs font-bold leading-none">✓</span>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium leading-snug ${
                      task.completed
                        ? "text-taupe line-through decoration-peach"
                        : "text-cocoa"
                    }`}
                  >
                    {task.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                  className="shrink-0 text-lg leading-none text-taupe/40 transition hover:text-ember/70"
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="animate-fade-up animation-delay-300 mt-6 flex items-center justify-between text-xs text-taupe">
          <span>
            {remainingCount === 0 && tasks.length > 0
              ? "All done — nice work"
              : `${remainingCount} task${remainingCount === 1 ? "" : "s"} remaining`}
          </span>
          <span className="tracking-wide">Saved locally</span>
        </div>
      </div>
    </div>
  );
}
