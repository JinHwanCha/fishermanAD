let currentData = {};
let isExpanded = false;
const VISIBLE_COUNT = 5;

window.addEventListener("load", () => {

    // 오프닝 애니메이션
    setTimeout(() => {
        document.querySelector('.wrap').classList.add('on');
    }, 500);

    fetchGoogleSheetData();

    document.querySelector(".popup_close").addEventListener("click", popupClose);
});

async function fetchGoogleSheetData() {
    try {
        const response = await fetch(
            "https://docs.google.com/spreadsheets/d/1fZ9UU4xTD0h0CpjLigxQpI-nYSdL4bIM3pE3YuI6gH8/gviz/tq?tqx=out:json"
        );
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        const rows = json.table.rows;

        const listElement = document.getElementById("data-list");
        listElement.innerHTML = "";

        rows.slice(1).forEach((row, index) => {
            let title = row.c[0]?.v || "";
            let applyLink = row.c[1]?.v || "#";
            let imageSrc = row.c[2]?.v || "";
            let category = row.c[3]?.v || "";
            let leaders = row.c[4]?.v || "";
            let kakaoID = row.c[5]?.v || "";
            let contentImg = row.c[6]?.v || "";
            let content = row.c[7]?.v || "";
            let linkTitle = row.c[8]?.v || "확인";
            let closeLink = row.c[9]?.v || "";

            const li = document.createElement("li");
            li.className = "item_link";

            // ✅ 초기엔 5개만 노출
            if (index >= VISIBLE_COUNT) {
                li.style.display = "none";
            }

            const button = document.createElement("button");
            button.className = "button";
            button.addEventListener("click", () =>
                popupOpen({
                    title,
                    link: applyLink,
                    imageSrc,
                    category,
                    leaders,
                    kakaoID,
                    contentImg,
                    content,
                    linkTitle,
                    closeLink
                })
            );

            const img = document.createElement("img");
            img.src = imageSrc;
            img.alt = category;

            button.appendChild(img);
            button.appendChild(document.createTextNode(title));
            li.appendChild(button);
            listElement.appendChild(li);
        });

        const toggleBtn = document.getElementById("toggleBtn");

        // 실제 아이템 개수 = rows.length - 1
        if (rows.length - 1 > VISIBLE_COUNT) {
            toggleBtn.style.display = "inline-block";
            toggleBtn.textContent = "더보기";
            toggleBtn.onclick = toggleList;
        } else {
            toggleBtn.style.display = "none";
        }

    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
    }
}

function toggleList() {
    const toggleBtn = document.getElementById("toggleBtn");
    const items = document.querySelectorAll(".item_link");
    const DURATION = 350;

    if (isExpanded) {
        // 🔽 접기 (슬라이드 업)
        items.forEach((item, index) => {
            if (index >= VISIBLE_COUNT) {
                // 현재 높이 고정
                const height = item.scrollHeight;
                item.style.height = height + "px";
                item.style.overflow = "hidden";

                // reflow
                item.offsetHeight;

                // 애니메이션
                item.style.transition = `height ${DURATION}ms ease`;
                item.style.height = "0px";

                // 종료 후 display:none
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
        // 🔼 펼치기 (슬라이드 다운)
        items.forEach((item, index) => {
            if (index >= VISIBLE_COUNT) {
                item.style.display = "block";

                // 초기 높이 0
                item.style.height = "0px";
                item.style.overflow = "hidden";

                // 실제 높이
                const height = item.scrollHeight;

                // reflow
                item.offsetHeight;

                // 애니메이션
                item.style.transition = `height ${DURATION}ms ease`;
                item.style.height = height + "px";

                // 종료 후 auto 복구
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


function popupOpen(data) {
    currentData = data;
    document.body.style.overflow = 'hidden';

    document.querySelector('.popup_title').textContent = currentData.title;
    document.querySelector('.leader_list').innerHTML = ` 
        <li class="leader">모임장:<br><span class="leader_name">${currentData.leaders}</span></li>
        <li class="leader">카톡ID:<br><span class="leader_name">${currentData.kakaoID}</span></li>
    `;

    const contentElement = document.querySelector('.content');
    contentElement.innerHTML = '';

    if (currentData.contentImg) {
        const img = document.createElement('img');
        img.src = currentData.contentImg;
        contentElement.appendChild(img);
    } else {
        const pre = document.createElement('pre');
        pre.textContent = currentData.content;
        contentElement.appendChild(pre);
    }

    document.querySelector('.link_wrap').innerHTML = `
        <a class="link ${currentData.closeLink}" href="${currentData.link}" target="_blank">
            ${currentData.linkTitle}
        </a>
    `;

    document.querySelector('.dim').style.display = 'block';
}

function popupClose() {
    document.querySelector('.dim').style.display = 'none';
    document.body.style.overflow = '';
}

document.querySelector(".popup_close").addEventListener("click", popupClose);
