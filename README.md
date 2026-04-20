# NexusAdmin — Custom Mazer Dashboard

> A production-grade admin dashboard built as a customization of the [Mazer](https://github.com/zuramai/mazer) template by Zuramai. Developed as part of a front-end internship assessment.

---

## 🖼️ Preview

| Light Mode | Dark Mode |
|---|---|
| ![Light Mode](assets/images/light-mode.png) | ![Dark Mode](assets/images/dark-mode.png) |

---

## ✨ Features

- **Dynamic Data Integration** — All stats, charts, tables, and the activity feed are populated from `assets/data/data.json` via the Fetch API (zero hardcoded HTML data)
- **Interactive Revenue Chart** — Dual-axis bar + line chart (Chart.js) with Monthly / Weekly toggle
- **Dark Mode Toggle** — Persistent via `localStorage`; chart colors update in real time
- **Live Search / Filter** — Instant client-side search on both the Transactions and Users tables
- **Activity Feed** — Real-time style event log with color-coded action icons
- **Notification Panel** — Dropdown with unread badges
- **Animated Stat Counters** — Smooth ease-out number animation on page load
- **Fully Responsive** — Mobile sidebar with overlay, fluid Bootstrap 5 grid
- **Clean Code Architecture** — Separated `api.js` (data layer) and `main.js` (UI layer), IIFE module pattern

---

## 📁 Project Structure

```
mazer-custom-dashboard/
│
├── index.html              # Login / landing page
├── dashboard.html          # Main dashboard view
├── README.md
│
└── assets/
    ├── css/
    │   └── custom.css      # Full custom theme (CSS variables, components)
    ├── js/
    │   ├── api.js          # Data fetching module (Fetch API + cache)
    │   └── main.js         # UI controller (charts, tables, interactivity)
    ├── data/
    │   └── data.json       # Mock data source (stats, chart, users, transactions)
    └── images/
        ├── light-mode.png
        └── dark-mode.png
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Mazer](https://github.com/zuramai/mazer) | Base admin template |
| Bootstrap 5.3 | Grid, layout, utilities |
| Chart.js 4 | Revenue & users chart |
| Feather Icons | Lightweight SVG icon set |
| Vanilla JS (ES6+) | Fetch API, modules, DOM, localStorage |
| Google Fonts (Sora + DM Mono) | Typography |
| CSS Custom Properties | Theming (light/dark) |

---

## 🚀 Setup Instructions

> **Note:** A local server is required because `fetch()` does not work over the `file://` protocol.

### Using Python

```bash
git clone https://github.com/lasyagovindwar/mazer-project.git
cd mazer-project
python -m http.server 8080
```

Then open: **http://localhost:8080**

### Using VS Code

1. Install the **Live Server** extension
2. Right-click `index.html` → **Open with Live Server**

---

## 📦 Files Modified from Mazer Base

| File | Change |
|---|---|
| `index.html` | Replaced with custom sign-in page |
| `dashboard.html` | Full layout rebuild with custom sidebar, topbar, widgets |
| `assets/css/custom.css` | New file — complete design system |
| `assets/js/api.js` | New file — data module |
| `assets/js/main.js` | New file — UI controller |
| `assets/data/data.json` | New file — mock data source |

---

## 🔄 Data Flow

```
data.json ──→ api.js (fetch + cache) ──→ main.js (bind to DOM)
                                          ├── renderStats()
                                          ├── renderChart(period)
                                          ├── renderTransactions()
                                          ├── renderUsers()
                                          └── renderActivityFeed()
```

---

## 🌙 Dark Mode

- Toggle using the moon/sun icon in the top bar
- Preference is saved to `localStorage` and applied on next load
- Chart.js chart re-renders with updated colors automatically

---

## 🔍 Search / Filter

- **Transactions table** — Searches across: ID, user name, type, status
- **Users table** — Searches across: name, email, role, status
- Filtering is real-time, client-side, with a "No results found" fallback

---

## 📄 License

Based on [Mazer](https://github.com/zuramai/mazer) by Zuramai — MIT License.  
Custom work © 2026
