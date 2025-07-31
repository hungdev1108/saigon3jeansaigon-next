"use client";

import { useEffect } from 'react';

export default function ClientScriptProvider() {
  useEffect(() => {
    const formatStatUnits = () => {
      // Tìm tất cả các phần tử .stats .stat-value
      const statValues = document.querySelectorAll('#eco-friendly .stats .stat-value');
      
      statValues.forEach((statValue) => {
        // Tìm span trong stat-value
        const span = statValue.querySelector('span');
        if (!span) return;
        
        const text = span.textContent || '';
        
        // Xử lý đặc biệt cho "boilers with 8-ton capacity"
        if (text.includes('boilers with 8-ton capacity')) {
          // Đã có CSS để xử lý xuống dòng, không cần dùng innerHTML để tránh lỗi hydration
          span.setAttribute('data-capacity', 'true');
          return;
        }
        
        // Xử lý các đơn vị khác
        const units = ['Megawatt/hour', 'm³/day', 'target', 'coverage', 'stage started'];
        
        units.forEach(unit => {
          if (text.includes(unit)) {
            // Thêm class thay vì thay đổi innerHTML để tránh lỗi hydration
            span.classList.add('has-unit');
            span.setAttribute('data-unit', unit);
          }
        });
      });
    };

    // Chạy hàm sau khi trang đã load
    setTimeout(formatStatUnits, 500);
    
    // Sử dụng MutationObserver để theo dõi các thay đổi trong DOM
    const observer = new MutationObserver((mutations) => {
      formatStatUnits();
    });
    
    // Theo dõi các thay đổi trong #eco-friendly
    const ecoFriendly = document.getElementById('eco-friendly');
    if (ecoFriendly) {
      observer.observe(ecoFriendly, { 
        childList: true, 
        subtree: true,
        characterData: true,
        attributes: true
      });
    }
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
} 