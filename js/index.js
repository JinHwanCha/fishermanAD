document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelector('.wrap').classList.add('on');
    }, 1000);

    let currentData = {};  // 현재 클릭한 모임의 데이터를 저장할 변수

    async function fetchGoogleSheetData() {
        try {
            const response = await fetch("https://docs.google.com/spreadsheets/d/1fZ9UU4xTD0h0CpjLigxQpI-nYSdL4bIM3pE3YuI6gH8/gviz/tq?tqx=out:json");
            const text = await response.text();
            
            const json = JSON.parse(text.substring(47, text.length - 2)); // Google Sheets 응답에서 불필요한 부분 제거
            const rows = json.table.rows; // 데이터 행 가져오기

            const listElement = document.getElementById("data-list");
            listElement.innerHTML = ""; // 기존 목록 초기화

            rows.forEach(row => {
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

                if (imageSrc && !imageSrc.startsWith("http")) {
                    imageSrc = "https://cdn.ardentnews.co.kr/news/photo/202409/" + imageSrc;
                }

                const li = document.createElement("li");
                li.classList.add("item_link");

                const button = document.createElement("button");
                button.classList.add("button");
                button.addEventListener("click", () => popupOpen({title, link: applyLink, imageSrc, category, leaders, kakaoID, contentImg, content, linkTitle, closeLink}));

                const img = document.createElement("img");
                img.src = imageSrc;
                img.alt = category;

                button.appendChild(img);
                button.appendChild(document.createTextNode(title));
                li.appendChild(button);
                listElement.appendChild(li);
            });

        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        }
    }

    function popupOpen(data) {
        currentData = data;

        document.body.style.overflow = 'hidden';

        document.querySelector('.popup_title').textContent = currentData.title;
        document.querySelector('.leader_list').innerHTML = ` 
            <li class="leader">모임장: <br><span class="leader_name">${currentData.leaders}</span></li>
            <li class="leader">카톡ID: <br><span class="leader_name">${currentData.kakaoID}</span></li>
        `;

        const contentElement = document.querySelector('.content');
        contentElement.innerHTML = '';

        if (currentData.contentImg) {
            const img = document.createElement('img');
            img.src = currentData.contentImg;
            img.alt = currentData.category;
            contentElement.appendChild(img);
        } else {
            const pre = document.createElement('pre');
            pre.textContent = currentData.content;
            contentElement.appendChild(pre);
        }

        document.querySelector('.link_wrap').innerHTML = `
            <a class="link ${currentData.closeLink}" href="${currentData.link}" target="_blank">${currentData.linkTitle}</a>
        `;

        document.querySelector('.dim').style.display = 'block';
    }

    function popupClose() {
        document.querySelector('.dim').style.display = 'none';
        document.body.style.overflow = '';
    }

    document.querySelector(".popup_close").addEventListener("click", popupClose);

    fetchGoogleSheetData();
});
