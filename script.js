(() => {
  const KEY = "oibsip-todo-v1";
  const THEMES = ["grid", "sticky", "rainbow", "violet"];
  const $ = (id) => document.getElementById(id);
  const app = document.querySelector(".app");

  let tasks = load();
  let editingId = null;

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch { /* storage unavailable */ }
  }
  const stamp = (ts) => new Date(ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  function showError(msg) {
    const el = $("error");
    el.textContent = msg;
    el.hidden = !msg;
  }

  function addTask(text, time) {
    tasks.unshift({ id: Date.now() + Math.random(), text, time, done: false, added: Date.now(), completed: null });
    save(); render();
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function button(label, cls, onClick) {
    const b = el("button", cls, label);
    b.type = "button";
    b.addEventListener("click", onClick);
    return b;
  }

  function buildItem(t) {
    const li = el("li", "task");

    const cb = el("input");
    cb.type = "checkbox";
    cb.checked = t.done;
    cb.setAttribute("aria-label", t.done ? "Mark as pending" : "Mark as complete");
    cb.addEventListener("change", () => {
      t.done = cb.checked;
      t.completed = t.done ? Date.now() : null;
      save(); render();
    });
    li.append(cb);

    if (editingId === t.id) {
      const inp = el("input", "edit-input");
      inp.type = "text"; inp.value = t.text; inp.maxLength = 120;
      inp.setAttribute("aria-label", "Edit task");
      const commit = () => {
        const v = inp.value.trim();
        if (v) t.text = v;
        editingId = null; save(); render();
      };
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") { editingId = null; render(); }
      });
      li.append(inp, el("span", "task-time", t.time || ""));
      const actions = el("div", "task-actions");
      actions.append(button("Save", "", commit), button("Cancel", "", () => { editingId = null; render(); }));
      li.append(actions);
      setTimeout(() => inp.focus(), 0);
      return li;
    }

    li.append(el("span", "task-text", t.text), el("span", "task-time", t.time || ""));
    li.append(el("span", "task-meta",
      t.done ? `Added ${stamp(t.added)} · Completed ${stamp(t.completed)}` : `Added ${stamp(t.added)}`));

    const actions = el("div", "task-actions");
    if (!t.done) actions.append(button("Edit", "", () => { editingId = t.id; render(); }));
    actions.append(button("Delete", "del", () => {
      tasks = tasks.filter((x) => x.id !== t.id);
      save(); render();
    }));
    li.append(actions);
    return li;
  }

  function render() {
    const pending = tasks.filter((t) => !t.done);
    const done = tasks.filter((t) => t.done);
    $("pendingList").replaceChildren(...pending.map(buildItem));
    $("doneList").replaceChildren(...done.map(buildItem));
    $("pendingCount").textContent = `${pending.length} pending`;
    $("doneCount").textContent = `${done.length} completed`;
    $("pendingEmpty").hidden = pending.length > 0;
    $("doneEmpty").hidden = done.length > 0;
  }

  $("addForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = $("taskInput").value.trim();
    if (!text) { showError("Enter a task name before adding."); $("taskInput").focus(); return; }
    showError("");
    addTask(text, $("timeInput").value);
    $("taskInput").value = ""; $("timeInput").value = "";
    $("taskInput").focus();
  });

  $("themeBtn").addEventListener("click", () => {
    const next = THEMES[(THEMES.indexOf(app.dataset.theme) + 1) % THEMES.length];
    app.dataset.theme = next;
    try { localStorage.setItem(KEY + "-theme", next); } catch { /* ignore */ }
  });

  try {
    const th = localStorage.getItem(KEY + "-theme");
    if (THEMES.includes(th)) app.dataset.theme = th;
  } catch { /* ignore */ }

  $("date").textContent = new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  render();
})();
