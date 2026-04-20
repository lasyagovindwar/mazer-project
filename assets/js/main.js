/**
 * main.js — UI controller for Mazer Custom Dashboard
 * Binds data from API to DOM: stats, tables, charts, activity feed.
 */

// ─── Utility ────────────────────────────────────────────────────────────────

const fmt = {
  currency: (n) =>
    "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 }),
  number: (n) => Number(n).toLocaleString("en-IN"),
  percent: (n) => `${n > 0 ? "+" : ""}${n}%`,
};

function animateCounter(el, target, formatter = (v) => v) {
  const duration = 1200;
  const start = performance.now();
  const startVal = 0;
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = formatter(value);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ─── Stats Cards ─────────────────────────────────────────────────────────────

async function renderStats() {
  const stats = await API.getStats();

  const map = [
    { id: "stat-users", value: stats.totalUsers, fmt: fmt.number },
    { id: "stat-revenue", value: stats.revenue, fmt: fmt.currency },
    { id: "stat-growth", value: stats.growth, fmt: (v) => `+${v}%` },
    { id: "stat-projects", value: stats.activeProjects, fmt: fmt.number },
  ];

  map.forEach(({ id, value, fmt: formatter }) => {
    const el = document.getElementById(id);
    if (el) animateCounter(el, value, formatter);
  });
}

// ─── Chart ───────────────────────────────────────────────────────────────────

let revenueChart = null;

async function renderChart(period = "monthly") {
  const ctx = document.getElementById("revenueChart");
  if (!ctx) return;

  const { labels, revenue, users } = await API.getChartData(period);
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  const config = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Revenue (₹)",
          data: revenue,
          backgroundColor: "rgba(99,102,241,0.85)",
          borderRadius: 6,
          borderSkipped: false,
          yAxisID: "y",
          order: 2,
        },
        {
          label: "New Users",
          data: users,
          type: "line",
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.12)",
          pointBackgroundColor: "#10b981",
          pointRadius: 4,
          tension: 0.4,
          fill: true,
          yAxisID: "y1",
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          labels: { color: textColor, usePointStyle: true, padding: 20 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.dataset.label.includes("Revenue"))
                return ` Revenue: ${fmt.currency(ctx.raw)}`;
              return ` Users: ${fmt.number(ctx.raw)}`;
            },
          },
        },
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: {
          position: "left",
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            callback: (v) => "₹" + (v >= 1000 ? v / 1000 + "k" : v),
          },
        },
        y1: {
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: { color: textColor },
        },
      },
    },
  };

  if (revenueChart) {
    revenueChart.data = config.data;
    revenueChart.options = config.options;
    revenueChart.update("active");
  } else {
    revenueChart = new Chart(ctx, config);
  }
}

// ─── Transactions Table ───────────────────────────────────────────────────────

let allTransactions = [];

function renderTransactionRow(tx) {
  const statusClass = {
    completed: "badge-success",
    pending: "badge-warning",
    refunded: "badge-secondary",
    failed: "badge-danger",
  }[tx.status] ?? "badge-secondary";

  const amountClass = tx.amount < 0 ? "text-danger" : "text-success";
  const amountStr =
    tx.amount < 0
      ? `-${fmt.currency(Math.abs(tx.amount))}`
      : fmt.currency(tx.amount);

  return `
    <tr>
      <td><span class="text-muted small">${tx.id}</span></td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="avatar-sm">${tx.avatar}</div>
          <span>${tx.user}</span>
        </div>
      </td>
      <td>${tx.type}</td>
      <td class="${amountClass} fw-semibold">${amountStr}</td>
      <td><span class="badge ${statusClass}">${tx.status}</span></td>
      <td class="text-muted small">${tx.date}</td>
    </tr>`;
}

async function renderTransactions() {
  const tbody = document.getElementById("txn-tbody");
  if (!tbody) return;

  allTransactions = await API.getTransactions();
  tbody.innerHTML = allTransactions.map(renderTransactionRow).join("");
}

// ─── Users Table ─────────────────────────────────────────────────────────────

let allUsers = [];

function renderUserRow(u) {
  const statusClass = u.status === "active" ? "badge-success" : "badge-secondary";
  const roleClass = {
    Admin: "badge-primary",
    Editor: "badge-info",
    Viewer: "badge-light",
  }[u.role] ?? "badge-light";

  return `
    <tr>
      <td><span class="text-muted small">${u.id}</span></td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="avatar-sm">${u.avatar}</div>
          <div>
            <div class="fw-semibold">${u.name}</div>
            <div class="text-muted small">${u.email}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${roleClass}">${u.role}</span></td>
      <td><span class="badge ${statusClass}">${u.status}</span></td>
      <td class="text-muted small">${u.joined}</td>
    </tr>`;
}

async function renderUsers() {
  const tbody = document.getElementById("users-tbody");
  if (!tbody) return;

  allUsers = await API.getUsers();
  tbody.innerHTML = allUsers.map(renderUserRow).join("");
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

async function renderActivityFeed() {
  const container = document.getElementById("activity-feed");
  if (!container) return;

  const feed = await API.getActivityFeed();

  container.innerHTML = feed
    .map(
      (item) => `
    <div class="activity-item d-flex align-items-start gap-3">
      <div class="activity-icon activity-icon--${item.color}">
        <i data-feather="${item.icon}" class="icon-sm"></i>
      </div>
      <div class="flex-grow-1">
        <p class="mb-0">
          <strong>${item.user}</strong> ${item.action}
          <span class="text-primary">${item.target}</span>
        </p>
        <span class="text-muted small">${item.time}</span>
      </div>
    </div>`
    )
    .join("");

  // Re-init feather after dynamic injection
  if (window.feather) feather.replace({ "stroke-width": 1.8 });
}

// ─── Search / Filter ─────────────────────────────────────────────────────────

function initSearch() {
  const txnSearch = document.getElementById("txn-search");
  if (txnSearch) {
    txnSearch.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = allTransactions.filter(
        (tx) =>
          tx.user.toLowerCase().includes(q) ||
          tx.id.toLowerCase().includes(q) ||
          tx.type.toLowerCase().includes(q) ||
          tx.status.toLowerCase().includes(q)
      );
      const tbody = document.getElementById("txn-tbody");
      tbody.innerHTML = filtered.length
        ? filtered.map(renderTransactionRow).join("")
        : `<tr><td colspan="6" class="text-center text-muted py-4">No results found.</td></tr>`;
    });
  }

  const userSearch = document.getElementById("user-search");
  if (userSearch) {
    userSearch.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.status.toLowerCase().includes(q)
      );
      const tbody = document.getElementById("users-tbody");
      tbody.innerHTML = filtered.length
        ? filtered.map(renderUserRow).join("")
        : `<tr><td colspan="5" class="text-center text-muted py-4">No results found.</td></tr>`;
    });
  }
}

// ─── Chart Period Toggle ──────────────────────────────────────────────────────

function initChartToggle() {
  const btns = document.querySelectorAll("[data-period]");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderChart(btn.dataset.period);
    });
  });
}

// ─── Dark Mode ───────────────────────────────────────────────────────────────

function initDarkMode() {
  const toggle = document.getElementById("dark-mode-toggle");
  if (!toggle) return;

  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
    // Rebuild chart so colors update
    const activePeriod =
      document.querySelector("[data-period].active")?.dataset.period || "monthly";
    renderChart(activePeriod);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.querySelector("#dark-mode-toggle i");
  if (icon) {
    icon.setAttribute("data-feather", theme === "dark" ? "sun" : "moon");
    if (window.feather) feather.replace({ "stroke-width": 1.8 });
  }
}

// ─── Sidebar Mobile Toggle ────────────────────────────────────────────────────

function initSidebar() {
  const toggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (!toggle || !sidebar) return;

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar--open");
    overlay?.classList.toggle("d-none");
  });

  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("sidebar--open");
    overlay.classList.add("d-none");
  });
}

// ─── Notifications ───────────────────────────────────────────────────────────

function initNotifications() {
  const bell = document.getElementById("notif-bell");
  const panel = document.getElementById("notif-panel");
  if (!bell || !panel) return;

  bell.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && e.target !== bell) {
      panel.classList.remove("show");
    }
  });
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────

function showSkeletons(show = true) {
  document.querySelectorAll(".skeleton-loader").forEach((el) => {
    el.style.display = show ? "block" : "none";
  });
  document.querySelectorAll(".content-block").forEach((el) => {
    el.style.opacity = show ? "0" : "1";
    el.style.transition = "opacity 0.3s ease";
  });
}

// ─── Boot ────────────────────────────────────────────────────────────────────

async function init() {
  initDarkMode();
  initSidebar();
  initNotifications();

  showSkeletons(true);

  try {
    await Promise.all([
      renderStats(),
      renderChart("monthly"),
      renderTransactions(),
      renderUsers(),
      renderActivityFeed(),
    ]);
  } catch (err) {
    console.error("[Dashboard] Init error:", err);
  } finally {
    showSkeletons(false);
  }

  initSearch();
  initChartToggle();

  if (window.feather) feather.replace({ "stroke-width": 1.8 });
}

document.addEventListener("DOMContentLoaded", init);
