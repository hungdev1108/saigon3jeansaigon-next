"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Parse Vietnamese number format (dots as thousand separators)
 * @param {string} value - String number với format Việt Nam
 * @returns {number} - Số đã parse
 */
function parseVietnameseNumber(value) {
  if (typeof value !== "string") return 0;

  // Remove all non-digit characters except dots and commas
  const cleanValue = value.trim();

  // Count dots and check pattern
  const dotCount = (cleanValue.match(/\./g) || []).length;
  const commaCount = (cleanValue.match(/,/g) || []).length;

  // If no dots or commas, simple number
  if (dotCount === 0 && commaCount === 0) {
    return parseFloat(cleanValue) || 0;
  }

  // Vietnamese format: dots as thousand separators
  // Examples: "50.000", "1.200.000"
  if (dotCount > 0 && commaCount === 0) {
    // Check if it's Vietnamese thousand separator format
    const parts = cleanValue.split(".");

    // If multiple dots, likely thousand separators
    if (dotCount > 1) {
      // Remove all dots (thousand separators)
      const numberString = cleanValue.replace(/\./g, "");
      return parseFloat(numberString) || 0;
    }

    // Single dot - could be decimal or thousand separator
    // Check if last part has 3 digits (likely thousand separator)
    const lastPart = parts[parts.length - 1];
    if (lastPart.length === 3 && parts.length === 2) {
      // Likely thousand separator: "50.000"
      const numberString = cleanValue.replace(/\./g, "");
      return parseFloat(numberString) || 0;
    }

    // Otherwise treat as decimal
    return parseFloat(cleanValue) || 0;
  }

  // Handle mixed formats (dots and commas)
  if (dotCount > 0 && commaCount > 0) {
    // Find last separator
    const lastDotIndex = cleanValue.lastIndexOf(".");
    const lastCommaIndex = cleanValue.lastIndexOf(",");

    if (lastCommaIndex > lastDotIndex) {
      // Comma is decimal separator, dots are thousand separators
      const numberString = cleanValue.replace(/\./g, "").replace(",", ".");
      return parseFloat(numberString) || 0;
    } else {
      // Dot is decimal separator, commas are thousand separators
      const numberString = cleanValue.replace(/,/g, "");
      return parseFloat(numberString) || 0;
    }
  }

  // Only commas (US format)
  if (commaCount > 0) {
    const numberString = cleanValue.replace(/,/g, "");
    return parseFloat(numberString) || 0;
  }

  return parseFloat(cleanValue) || 0;
}

/**
 * Format number theo kiểu Việt Nam (dấu chấm cho thousands)
 * @param {number} value - Số cần format
 * @param {string} originalString - Chuỗi gốc để detect format style
 * @returns {string} - Chuỗi đã format
 */
function formatVietnameseNumber(value, originalString) {
  if (typeof originalString !== "string") {
    return value.toLocaleString("vi-VN");
  }

  // Detect if original uses Vietnamese format (dots as thousand separators)
  const hasDots = originalString.includes(".");
  const hasCommas = originalString.includes(",");

  // If original has dots and no commas, use Vietnamese format
  if (hasDots && !hasCommas) {
    return value.toLocaleString("vi-VN");
  }

  // If original has commas, use US format
  if (hasCommas) {
    return value.toLocaleString("en-US");
  }

  // Default to Vietnamese format
  return value.toLocaleString("vi-VN");
}

/**
 * Custom hook để tạo counter animation
 * @param {number|string} targetValue - Giá trị đích cần đếm đến
 * @param {number} duration - Thời gian animation (ms)
 * @param {boolean} startAnimation - Có bắt đầu animation hay không
 * @returns {number} - Giá trị hiện tại đang animate
 */
export function useCounterAnimation(
  targetValue,
  duration = 2000,
  startAnimation = false
) {
  const [currentValue, setCurrentValue] = useState(0);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!startAnimation) {
      setCurrentValue(0);
      return;
    }

    // Parse target value to number - handle Vietnamese format (dots as thousand separators)
    const target =
      typeof targetValue === "string"
        ? parseVietnameseNumber(targetValue)
        : targetValue;

    if (isNaN(target) || target === 0) {
      setCurrentValue(target);
      return;
    }

    // Easing function for smooth animation
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing
      const easedProgress = easeOutCubic(progress);
      const current = Math.floor(target * easedProgress);

      setCurrentValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(target);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [targetValue, duration, startAnimation]);

  return currentValue;
}

/**
 * Hook để detect khi element vào viewport và trigger animation
 * @param {Object} options - Intersection Observer options
 * @returns {Array} - [ref, isIntersecting]
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setIsIntersecting(true);
          setHasTriggered(true); // Chỉ trigger một lần
        }
      },
      {
        threshold: 0.3, // Trigger khi 30% element visible
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasTriggered, options]);

  return [targetRef, isIntersecting];
}

/**
 * Format number với dấu phẩy và giữ nguyên format gốc
 * @param {number} value - Giá trị cần format
 * @param {string} originalString - Chuỗi gốc để lấy format
 * @returns {string} - Chuỗi đã format
 */
export function formatCounterValue(value, originalString) {
  return formatVietnameseNumber(value, originalString);
}
