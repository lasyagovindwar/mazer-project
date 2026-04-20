/**
 * api.js — Data layer for Mazer Custom Dashboard
 * Handles all fetch calls and data transformation.
 */

const API = (() => {
  const DATA_URL = "./assets/data/data.json";
  let _cache = null;

  /** Fetch and cache the JSON data source. */
  async function fetchAll() {
    if (_cache) return _cache;
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      _cache = await res.json();
      return _cache;
    } catch (err) {
      console.error("[API] Failed to load data.json:", err);
      throw err;
    }
  }

  async function getStats() {
    const data = await fetchAll();
    return data.stats;
  }

  async function getChartData(period = "monthly") {
    const data = await fetchAll();
    return data.chartData[period] ?? data.chartData.monthly;
  }

  async function getTransactions() {
    const data = await fetchAll();
    return data.recentTransactions;
  }

  async function getUsers() {
    const data = await fetchAll();
    return data.recentUsers;
  }

  async function getActivityFeed() {
    const data = await fetchAll();
    return data.activityFeed;
  }

  return { fetchAll, getStats, getChartData, getTransactions, getUsers, getActivityFeed };
})();
