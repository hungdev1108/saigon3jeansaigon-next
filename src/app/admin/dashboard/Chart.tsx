"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  date: string;
  fullDate: string;
  "Lượt truy cập": number;
  "Người truy cập": number;
}

interface ChartProps {
  data: ChartData[];
}

export default function Chart({ data }: ChartProps) {
  if (!data || data.length === 0) {
    return <div style={{ height: 210, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>Chưa có dữ liệu</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={210}>
      <LineChart 
        data={data} 
        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          fontSize={12}
          fontWeight={900}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#6b7280" }}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          fontWeight={900}
          tickLine={false}
          axisLine={false}
          width={50}
          tick={{ fill: "#6b7280" }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            border: "none",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
          }}
          labelStyle={{
            color: "#ffffff",
            fontWeight: 900,
            fontSize: "14px",
            marginBottom: "8px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            paddingBottom: "6px",
          }}
          itemStyle={{
            color: "#d1d5db",
            fontSize: "12px",
            fontWeight: 600,
          }}
          formatter={(value: number | undefined, name: string | undefined) => [
            value ? value.toLocaleString("vi-VN") : "0",
            name || "",
          ]}
          labelFormatter={(label: unknown) => {
            const labelStr = String(label || "");
            const fullDate = data.find((d) => d.date === labelStr)?.fullDate;
            return fullDate ? fullDate.split("-").reverse().join("/") : labelStr;
          }}
        />
        <Line
          type="monotone"
          dataKey="Lượt truy cập"
          stroke="rgba(37, 99, 235, 0.95)"
          strokeWidth={3}
          dot={{ fill: "rgba(37, 99, 235, 0.95)", r: 6, strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 8, strokeWidth: 2, stroke: "#ffffff" }}
        />
        <Line
          type="monotone"
          dataKey="Người truy cập"
          stroke="rgba(22, 163, 74, 0.95)"
          strokeWidth={3}
          dot={{ fill: "rgba(22, 163, 74, 0.95)", r: 6, strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 8, strokeWidth: 2, stroke: "#ffffff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

