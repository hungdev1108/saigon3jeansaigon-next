"use client";

import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { FiCalendar, FiEye, FiRefreshCw, FiTrendingUp, FiUsers } from "react-icons/fi";
import { BACKEND_DOMAIN } from "@/api/config";
import Chart from "./Chart";
import styles from "./dashboard.module.css";

interface SeriesData {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

interface MetricsData {
  success: boolean;
  timezone?: string;
  generatedAt?: string;
  today?: {
    date: string;
    visits: number;
    uniqueVisitors: number;
  };
  last7Days?: {
    start: string;
    end: string;
    visits: number;
    uniqueVisitors: number;
    series: SeriesData[];
  };
  thisMonth?: {
    start: string;
    end: string;
    visits: number;
    uniqueVisitors: number;
  };
  message?: string;
}

const fetchMetrics = async (): Promise<MetricsData> => {
  const res = await fetch(`${BACKEND_DOMAIN}/api/analytics/metrics`, { cache: "no-store" });
  return await res.json();
};

interface RangeInfoProps {
  title: string;
  icon: React.ReactNode;
  subtitle: string;
}

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  accent: "blue" | "green" | "purple";
  visits?: number;
  unique?: number;
  hint?: string;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMetrics();
      if (!data?.success) {
        setError(data?.message || "Không thể tải thống kê");
        return;
      }
      setMetrics(data);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Không thể tải thống kê";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const chartData = useMemo(() => {
    const s: SeriesData[] = metrics?.last7Days?.series || [];
    return s.map((d: SeriesData) => ({
      date: d.date?.slice(5) || "",
      fullDate: d.date || "",
      "Lượt truy cập": Number(d.visits || 0),
      "Người truy cập": Number(d.uniqueVisitors || 0),
    }));
  }, [metrics]);

  const RangeInfo = ({ title, icon, subtitle }: RangeInfoProps) => (
    <div className={styles.rangeInfo}>
      <div className={styles.rangeIcon}>{icon}</div>
      <div className={styles.rangeText}>
        <div className={styles.rangeTitle}>{title}</div>
        <div className={styles.rangeSubtitle}>{subtitle}</div>
      </div>
    </div>
  );

  const StatCard = memo(({ title, icon, accent, visits, unique, hint, isLoading }: StatCardProps & { isLoading: boolean }) => (
    <div className={`${styles.statCard} ${styles[accent]}`}>
      <div className={styles.statCardHeader}>
        <div className={styles.statIconWrapper}>
          <div className={styles.statIcon}>{icon}</div>
        </div>
        <div className={styles.statMeta}>
          <div className={styles.statTitle}>{title}</div>
          {!!hint && <div className={styles.statHint}>{hint}</div>}
        </div>
      </div>

      <div className={styles.statContent}>
        <div className={styles.statMetric}>
          <div className={styles.statLabel}>Lượt truy cập</div>
          <div className={`${styles.statValue} ${styles.visits}`}>{isLoading ? "..." : Number(visits || 0).toLocaleString("vi-VN")}</div>
        </div>
        <div className={styles.statMetric}>
          <div className={styles.statLabel}>Người truy cập (unique)</div>
          <div className={`${styles.statValue} ${styles.unique}`}>{isLoading ? "..." : Number(unique || 0).toLocaleString("vi-VN")}</div>
        </div>
      </div>
    </div>
  ));
  StatCard.displayName = "StatCard";

  return (
    <div className={styles.dash}>
      <div className={styles.bg} />
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.h1}>Dashboard thống kê truy cập</h1>
          <p className={styles.sub}>Số liệu được tính theo múi giờ Việt Nam (Asia/Ho_Chi_Minh) • Unique theo session</p>
        </div>

        <button className={styles.btn} onClick={load} disabled={loading}>
          <FiRefreshCw className={loading ? styles.spin : ""} />
          Làm mới
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.ranges}>
        <RangeInfo
          title="Hôm nay"
          icon={<FiCalendar />}
          subtitle={metrics?.today?.date ? metrics.today.date.split("-").reverse().join("/") : ""}
        />
        <RangeInfo
          title="7 ngày gần nhất"
          icon={<FiTrendingUp />}
          subtitle={
            metrics?.last7Days?.start && metrics?.last7Days?.end
              ? `${metrics.last7Days.start.split("-").reverse().join("/")} - ${metrics.last7Days.end
                  .split("-")
                  .reverse()
                  .join("/")}`
              : ""
          }
        />
        <RangeInfo
          title="Tháng này"
          icon={<FiCalendar />}
          subtitle={
            metrics?.thisMonth?.start && metrics?.thisMonth?.end
              ? `${metrics.thisMonth.start.split("-").reverse().join("/")} - ${metrics.thisMonth.end
                  .split("-")
                  .reverse()
                  .join("/")}`
              : ""
          }
        />
      </div>

      <div className={styles.grid}>
        <StatCard
          title="Hôm nay"
          icon={<FiEye />}
          accent="blue"
          visits={metrics?.today?.visits}
          unique={metrics?.today?.uniqueVisitors}
          hint="Tính trong ngày hiện tại (VN)"
          isLoading={loading}
        />

        <StatCard
          title="7 ngày gần nhất"
          icon={<FiTrendingUp />}
          accent="purple"
          visits={metrics?.last7Days?.visits}
          unique={metrics?.last7Days?.uniqueVisitors}
          hint="Rolling 7 days (VN)"
          isLoading={loading}
        />

        <StatCard
          title="Tháng này"
          icon={<FiUsers />}
          accent="green"
          visits={metrics?.thisMonth?.visits}
          unique={metrics?.thisMonth?.uniqueVisitors}
          hint="Từ đầu tháng tới hiện tại (VN)"
          isLoading={loading}
        />
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <div className={styles.panelTitle}>
              Xu hướng 7 ngày gần nhất
            </div>
          </div>
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.blue}`} /> Lượt truy cập
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.green}`} /> Người truy cập
            </span>
          </div>
        </div>

        <div className={styles.panelBody}>
          {loading ? (
            <div className={styles.empty}>Đang tải...</div>
          ) : !chartData || chartData.length === 0 ? (
            <div className={styles.empty}>Chưa có dữ liệu</div>
          ) : (
            <div className={styles.chartWrap}>
              <div className={styles.rechartsContainer}>
                <Chart data={chartData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
