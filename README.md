# NexusAdmin — Custom Mazer Dashboard

> A production-grade admin dashboard built as a customization of the [Mazer](https://github.com/zuramai/mazer) template by Zuramai. Developed as part of a front-end internship assessment.

---

## 🖼️ Preview

| Light Mode | Dark Mode |
|---|---|
| *(Add screenshot here)* | *(Add screenshot here)* |

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
    └── images/             # Place screenshots / assets here
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

### Option A — Run Locally (Recommended)

You need a local server because `fetch()` requires HTTP (not `file://`).

**Using VS Code Live Server:**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Open the project folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. Navigate to `http://127.0.0.1:5500`

**Using Python:**
```bash
cd mazer-custom-dashboard
python -m http.server 8080
# Open http://localhost:8080
```

**Using Node.js (`serve`):**
```bash
npx serve mazer-custom-dashboard
```

### Option B — From the Mazer Base Template

```bash
# 1. Fork & clone Mazer
git clone https://github.com/zuramai/mazer.git
cd mazer

# 2. Copy customized files into the correct locations
cp /path/to/mazer-custom-dashboard/index.html .
cp /path/to/mazer-custom-dashboard/dashboard.html .
cp -r /path/to/mazer-custom-dashboard/assets/css/custom.css assets/compiled/css/
cp -r /path/to/mazer-custom-dashboard/assets/js/ assets/js/
cp -r /path/to/mazer-custom-dashboard/assets/data/ assets/data/

# 3. Serve and open
```

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
data.json  ──→  api.js (fetch + cache)  ──→  main.js (bind to DOM)
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
- The Chart.js chart re-renders with updated colors automatically

---

## 🔍 Search / Filter

- **Transactions table** — Searches across: ID, user name, type, status
- **Users table** — Searches across: name, email, role, status
- Filtering is real-time, client-side, with a "No results found" fallback

---

## 📤 Deployment (GitHub Pages)

```bash
# After forking & cloning:
git add .
git commit -m "feat: add NexusAdmin custom dashboard"
git push origin main

# In GitHub repo → Settings → Pages → Source: main branch → /root
# Live URL: https://<your-username>.github.io/mazer/
```

---

## ✅ Pre-Submission Checklist

- [ ] All 6 files present and connected
- [ ] `data.json` loads correctly (test in browser DevTools → Network tab)
- [ ] Stats cards animate on load
- [ ] Chart renders for both Monthly and Weekly
- [ ] Dark mode toggles and persists on refresh
- [ ] Search filters both tables correctly
- [ ] Activity feed populates
- [ ] Notification bell opens/closes panel
- [ ] Sidebar hamburger works on mobile (< 992px)
- [ ] No console errors
- [ ] README is complete with your name / repo link
- [ ] Pushed to GitHub with clean commit history

---

## 👤 Author

**[Your Name]**  
Front-End Intern  
GitHub: [@yourusername](https://github.com/yourusername)

---

## 📄 License

Based on [Mazer](https://github.com/zuramai/mazer) by Zuramai — MIT License.  
Custom work © 2026 [Your Name].
