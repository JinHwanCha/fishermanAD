let isExpanded = false;
const VISIBLE_COUNT = 5;

/* ===============================
   토글 초기화
================================ */
function initToggle() {
    initListVisibility();
    
    const items = document.querySelectorAll(".item_link");
    const totalCount = items.length;
    
    initToggleButton(totalCount);
}

/* ===============================
   초기 5개 노출
================================ */
function initListVisibility() {
    const items = document.querySelectorAll(".item_link");

    items.forEach((item, index) => {
        if (index >= VISIBLE_COUNT) {
            item.style.display = "none";
        }
    });

    isExpanded = false;
}

/* ===============================
   더보기 / 접기 버튼 초기화
================================ */
function initToggleButton(totalCount) {
    const toggleBtn = document.getElementById("toggleBtn");

    if (totalCount > VISIBLE_COUNT) {
        toggleBtn.style.display = "inline-block";
        toggleBtn.textContent = "더보기";
        toggleBtn.onclick = toggleList;
    } else {
        toggleBtn.style.display = "none";
    }
}

/* ===============================
   더보기 / 접기 애니메이션
================================ */
function toggleList() {
    const toggleBtn = document.getElementById("toggleBtn");
    const items = document.querySelectorAll(".item_link");
    const DURATION = 350;

    if (isExpanded) {
        // 🔽 접기
        items.forEach((item, index) => {
            if (index >= VISIBLE_COUNT) {
                const height = item.scrollHeight;
                item.style.height = height + "px";
                item.style.overflow = "hidden";
                item.offsetHeight;

                item.style.transition = `height ${DURATION}ms ease`;
                item.style.height = "0px";

                setTimeout(() => {
                    item.style.display = "none";
                    item.style.height = "";
                    item.style.transition = "";
                    item.style.overflow = "";
                }, DURATION);
            }
        });

        toggleBtn.textContent = "더보기";
        isExpanded = false;

    } else {
        // 🔼 펼치기
        items.forEach((item, index) => {
            if (index >= VISIBLE_COUNT) {
                item.style.display = "block";
                item.style.height = "0px";
                item.style.overflow = "hidden";

                const height = item.scrollHeight;
                item.offsetHeight;

                item.style.transition = `height ${DURATION}ms ease`;
                item.style.height = height + "px";

                setTimeout(() => {
                    item.style.height = "auto";
                    item.style.transition = "";
                    item.style.overflow = "";
                }, DURATION);
            }
        });

        toggleBtn.textContent = "접기";
        isExpanded = true;
    }
}

// 리스트가 렌더링된 후 토글 초기화 실행
window.addEventListener("DOMContentLoaded", () => {
    let attempts = 0;
    const maxAttempts = 50; // 최대 5초 대기
    
    const checkList = setInterval(() => {
        const items = document.querySelectorAll(".item_link");
        attempts++;
        
        if (items.length > 0) {
            clearInterval(checkList);
            initToggle();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkList);
            console.warn('토글 초기화 실패: 리스트를 찾을 수 없습니다.');
        }
    }, 100);
});
