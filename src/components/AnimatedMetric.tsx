"use client";

import React from "react";
import {
  useCounterAnimation,
  formatCounterValue,
} from "../app/hooks/useCounterAnimation";

interface AnimatedMetricProps {
  value: string;
  unit?: string;
  label: string;
  icon: string;
  startAnimation: boolean;
  duration?: number;
}

export default function AnimatedMetric({
  value,
  unit,
  label,
  icon,
  startAnimation,
  duration = 2000,
}: AnimatedMetricProps) {
  // Use hook for animation (hook will handle parsing internally)
  const animatedValue = useCounterAnimation(
    value, // Pass original string to hook
    duration,
    startAnimation
  );

  // Format animated value giống như original
  const formattedValue = formatCounterValue(animatedValue, value);

  // Parse target value để so sánh với animated value
  const parseVietnameseNumber = (value: string): number => {
    if (typeof value !== "string") return 0;
    const cleanValue = value.trim();
    const dotCount = (cleanValue.match(/\./g) || []).length;
    const commaCount = (cleanValue.match(/,/g) || []).length;
    if (dotCount === 0 && commaCount === 0) {
      return parseFloat(cleanValue) || 0;
    }
    if (dotCount > 0 && commaCount === 0) {
      const parts = cleanValue.split(".");
      if (dotCount > 1) {
        const numberString = cleanValue.replace(/\./g, "");
        return parseFloat(numberString) || 0;
      }
      const lastPart = parts[parts.length - 1];
      if (lastPart.length === 3 && parts.length === 2) {
        const numberString = cleanValue.replace(/\./g, "");
        return parseFloat(numberString) || 0;
      }
      return parseFloat(cleanValue) || 0;
    }
    return parseFloat(cleanValue.replace(/[^\d]/g, "")) || 0;
  };

  const targetValue = parseVietnameseNumber(value);

  // Check if currently animating
  const isAnimating = startAnimation && animatedValue < targetValue;

  // If not animating and original value is decimal, show original string
  const isDecimal = value.includes('.') && !/^\d+$/.test(value.replace(/\./g, ''));
  const displayValue = !isAnimating && isDecimal ? value : formattedValue;

  return (
    <div className="metric-item">
      <div className="metric-icon">
        <i className={icon}></i>
      </div>
      <div className={`metric-value ${isAnimating ? "animating" : ""}`}>
        {displayValue} {unit && (
          <span className="metric-unit">
            {unit.includes("²") ? (
              <>
                {unit.replace("²", "")}
                <sup>2</sup>
              </>
            ) : (
              unit
            )}
          </span>
        )}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
}
