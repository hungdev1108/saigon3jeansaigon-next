export const FormatTime = {
    getRelativeTime(isoDate, locale = 'vi-VN') {
        try {
            const date = new Date(isoDate);
            const now = new Date();

            if (isNaN(date.getTime())) {
                return 'Thời gian không hợp lệ';
            }

            const diffMs = now - date;
            const diffSecs = Math.floor(diffMs / 1000);
            const diffMins = Math.floor(diffSecs / 60);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);
            const diffWeeks = Math.floor(diffDays / 7);
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);

            const messages = {
                "vi-VN": {
                    justNow: 'vừa xong',
                    secondsAgo: (n) => `${n} giây trước`,
                    minuteAgo: '1 phút trước',
                    minutesAgo: (n) => `${n} phút trước`,
                    hourAgo: '1 giờ trước',
                    hoursAgo: (n) => `${n} giờ trước`,
                    dayAgo: 'hôm qua',
                    daysAgo: (n) => `${n} ngày trước`,
                    weekAgo: '1 tuần trước',
                    weeksAgo: (n) => `${n} tuần trước`,
                    monthAgo: '1 tháng trước',
                    monthsAgo: (n) => `${n} tháng trước`,
                    yearAgo: '1 năm trước',
                    yearsAgo: (n) => `${n} năm trước`,
                    future: 'trong tương lai'
                },
                "en-US": {
                    justNow: 'Just Now',
                    secondsAgo: (n) => `${n} Seconds Ago`,
                    minuteAgo: '1 Minute Ago',
                    minutesAgo: (n) => `${n} Minutes Ago`,
                    hourAgo: '1 Hour Ago',
                    hoursAgo: (n) => `${n} Hours Ago`,
                    dayAgo: 'yesterday',
                    daysAgo: (n) => `${n} Days Ago`,
                    weekAgo: '1 Week Ago',
                    weeksAgo: (n) => `${n} Weeks Ago`,
                    monthAgo: '1 month ago',
                    monthsAgo: (n) => `${n} Months Ago`,
                    yearAgo: '1 Year Ago',
                    yearsAgo: (n) => `${n} Years Ago`,
                    future: 'In The Future'
                }
            };

            const msg = messages[locale] || messages.vi;

            if (diffMs < 0) {
                return msg.future;
            }

            if (diffSecs < 10) return msg.justNow;
            if (diffSecs < 60) return msg.secondsAgo(diffSecs);
            if (diffMins === 1) return msg.minuteAgo;
            if (diffMins < 60) return msg.minutesAgo(diffMins);
            if (diffHours === 1) return msg.hourAgo;
            if (diffHours < 24) return msg.hoursAgo(diffHours);
            if (diffDays === 1) return msg.dayAgo;
            if (diffDays < 7) return msg.daysAgo(diffDays);
            if (diffWeeks === 1) return msg.weekAgo;
            if (diffWeeks < 4) return msg.weeksAgo(diffWeeks);
            if (diffMonths === 1) return msg.monthAgo;
            if (diffMonths < 12) return msg.monthsAgo(diffMonths);
            if (diffYears === 1) return msg.yearAgo;
            return msg.yearsAgo(diffYears);

        } catch (error) {
            console.error('Error parsing date:', error);
            return 'Lỗi định dạng thời gian';
        }
    }
};
