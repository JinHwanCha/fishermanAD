/* ===============================
   캘린더 렌더링
================================ */
function renderCalendar() {
    const calendarWrapper = document.querySelector('.calendar-wrapper');
    if (!calendarWrapper) {
        console.warn('캘린더 wrapper를 찾을 수 없습니다.');
        return;
    }
    
    // 이미 iframe이 있다면 리턴
    if (calendarWrapper.querySelector('iframe')) {
        return;
    }
    
    try {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://calendar.google.com/calendar/embed?src=1cc384df8081335a97628b2d6e4170a84430dae267b3fd579e418ffdee35ffad%40group.calendar.google.com&ctz=Asia%2FSeoul';
        iframe.style.border = '0';
        iframe.width = '100%';
        iframe.height = '600';
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';
        iframe.title = 'FishermenMoim Calendar';
        iframe.loading = 'lazy'; // 성능 최적화
        
        calendarWrapper.appendChild(iframe);
    } catch (error) {
        console.error('캘린더 렌더링 중 오류:', error);
    }
}

// DOM 로드 완료 후 캘린더 렌더링
window.addEventListener("DOMContentLoaded", () => {
    renderCalendar();
});
