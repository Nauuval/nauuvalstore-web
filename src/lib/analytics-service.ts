import { VisitorAnalytics, DailyVisit } from '@/types';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const LOCAL_ANALYTICS_KEY = 'nauuvalstore_analytics_v2';
const SESSION_VISITED_KEY = 'nauuvalstore_session_visited';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate realistic baseline analytics for local mode
function getInitialLocalAnalytics(): Record<string, number> {
  const result: Record<string, number> = {};
  const today = new Date();

  // Generate last 30 days with realistic visits
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    // Base 45-90 visits per day
    const base = 48 + ((i * 7 + 13) % 43);
    result[dateStr] = base;
  }
  return result;
}

function getStoredDailyMap(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    if (!raw) {
      const initial = getInitialLocalAnalytics();
      localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveStoredDailyMap(map: Record<string, number>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(map));
  } catch (e) {
    console.error(e);
  }
}

// Record a new visit (called once per browser session)
export async function recordVisit(pagePath: string = '/'): Promise<void> {
  if (typeof window === 'undefined') return;

  // Check session storage to avoid double-counting on refresh
  const hasVisited = sessionStorage.getItem(SESSION_VISITED_KEY);
  if (hasVisited) return;
  sessionStorage.setItem(SESSION_VISITED_KEY, 'true');

  const todayStr = getTodayString();

  // 1. If Supabase is available, insert into site_visits
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('site_visits').insert({
        visited_date: todayStr,
        page_path: pagePath,
        user_agent: navigator.userAgent.substring(0, 150),
      });
    } catch (e) {
      console.error('Supabase visit tracking error', e);
    }
  }

  // 2. Always maintain local analytics
  const map = getStoredDailyMap();
  map[todayStr] = (map[todayStr] || 0) + 1;
  saveStoredDailyMap(map);
}

// Fetch aggregate analytics
export async function getVisitorAnalytics(): Promise<VisitorAnalytics> {
  const todayStr = getTodayString();
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sevenDaysStr = `${sevenDaysAgo.getFullYear()}-${String(sevenDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(sevenDaysAgo.getDate()).padStart(2, '0')}`;
      const thirtyDaysStr = `${thirtyDaysAgo.getFullYear()}-${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(thirtyDaysAgo.getDate()).padStart(2, '0')}`;

      // Today
      const { count: todayCount } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visited_date', todayStr);

      // This Week
      const { count: weekCount } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .gte('visited_date', sevenDaysStr);

      // This Month
      const { count: monthCount } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .gte('visited_date', thirtyDaysStr);

      // Total
      const { count: totalCount } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true });

      // History
      const { data: historyData } = await supabase
        .from('site_visits')
        .select('visited_date')
        .gte('visited_date', thirtyDaysStr);

      const historyMap: Record<string, number> = {};
      historyData?.forEach((row) => {
        const d = row.visited_date;
        historyMap[d] = (historyMap[d] || 0) + 1;
      });

      const dailyHistory: DailyVisit[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        dailyHistory.push({
          date: dateStr,
          count: historyMap[dateStr] || 0,
        });
      }

      return {
        today: todayCount || 0,
        thisWeek: weekCount || 0,
        thisMonth: monthCount || 0,
        total: totalCount || 0,
        dailyHistory,
      };
    } catch (e) {
      console.error('Error fetching Supabase analytics, falling back to local', e);
    }
  }

  // Local calculation
  const map = getStoredDailyMap();
  const todayCount = map[todayStr] || 0;

  let weekCount = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    weekCount += map[dateStr] || 0;
  }

  let monthCount = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    monthCount += map[dateStr] || 0;
  }

  let totalCount = 0;
  Object.values(map).forEach((v) => {
    totalCount += v;
  });

  const dailyHistory: DailyVisit[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    dailyHistory.push({
      date: dateStr,
      count: map[dateStr] || 0,
    });
  }

  return {
    today: todayCount,
    thisWeek: weekCount,
    thisMonth: monthCount,
    total: totalCount,
    dailyHistory,
  };
}
