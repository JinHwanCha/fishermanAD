let currentData = {};

window.addEventListener("load", async () => {

    // 구글 시트 데이터 먼저 로드
    await fetchGoogleSheetData();

    // 데이터 로딩 완료 후 오프닝 애니메이션
    setTimeout(() => {
        document.querySelector('.wrap').classList.add('on');
    }, 500);

    document.querySelector(".popup_close").addEventListener("click", popupClose);
});

/* ===============================
   1️⃣ 구글 시트 데이터 fetch
================================ */
async function fetchGoogleSheetData() {
    try {
        const response = await fetch(
            "https://docs.google.com/spreadsheets/d/1fZ9UU4xTD0h0CpjLigxQpI-nYSdL4bIM3pE3YuI6gH8/gviz/tq?tqx=out:json"
        );
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        const rows = json.table.rows;

        renderList(rows.slice(1));

    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
    }
}

/* ===============================
   2️⃣ 리스트 렌더링
================================ */
function renderList(rows) {
    const listElement = document.getElementById("data-list");
    if (!listElement) {
        console.error('data-list 요소를 찾을 수 없습니다.');
        return;
    }
    
    listElement.innerHTML = "";

    rows.forEach((row) => {
        const data = {
            title: row.c[0]?.v || "",
            link: row.c[1]?.v || "#",
            imageSrc: row.c[2]?.v || "",
            category: row.c[3]?.v || "",
            leaders: row.c[4]?.v || "",
            kakaoID: row.c[5]?.v || "",
            contentImg: row.c[6]?.v || "",
            content: row.c[7]?.v || "",
            linkTitle: row.c[8]?.v || "확인",
            closeLink: row.c[9]?.v || ""
        };

        const li = document.createElement("li");
        li.className = "item_link";

        const button = document.createElement("button");
        button.className = "button";
        button.addEventListener("click", () => popupOpen(data));

        const img = document.createElement("img");
        img.src = data.imageSrc;
        img.alt = data.category;

        button.appendChild(img);
        button.appendChild(document.createTextNode(data.title));
        li.appendChild(button);

        listElement.appendChild(li);
    });
}

/* ===============================
   3️⃣ 팝업 열기
================================ */
function popupOpen(data) {
    if (!data) return;
    
    currentData = data;
    document.body.style.overflow = 'hidden';

    const popupTitle = document.querySelector('.popup_title');
    if (popupTitle) {
        popupTitle.textContent = currentData.title;
    }

    const leaderList = document.querySelector('.leader_list');
    if (leaderList) {
        leaderList.innerHTML = `
            <li class="leader">모임장:<br><span class="leader_name">${currentData.leaders}</span></li>
            <li class="leader">카톡ID:<br><span class="leader_name">${currentData.kakaoID}</span></li>
        `;
    }

    const contentElement = document.querySelector('.content');
    if (contentElement) {
        contentElement.innerHTML = '';

        if (currentData.contentImg) {
            const img = document.createElement('img');
            img.src = currentData.contentImg;
            img.alt = currentData.title || '모임 이미지';
            contentElement.appendChild(img);
        } else {
            const pre = document.createElement('pre');
            pre.textContent = currentData.content;
            contentElement.appendChild(pre);
        }
    }

    const linkWrap = document.querySelector('.link_wrap');
    if (linkWrap) {
        linkWrap.innerHTML = `
            <a class="link ${currentData.closeLink}" href="${currentData.link}" target="_blank" rel="noopener noreferrer">
                ${currentData.linkTitle}
            </a>
        `;
    }

    const dim = document.querySelector('.dim');
    if (dim) {
        dim.style.display = 'block';
    }
}

/* ===============================
   4️⃣ 팝업 닫기
================================ */
function popupClose() {
    document.querySelector('.dim').style.display = 'none';
    document.body.style.overflow = '';
}