document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelector('.wrap').classList.add('on');
    }, 1000);

    let currentData = {};
    let isExpanded = false;

    async function fetchGoogleSheetData() {
        try {
            const response = await fetch("https://docs.google.com/spreadsheets/d/1fZ9UU4xTD0h0CpjLigxQpI-nYSdL4bIM3pE3YuI6gH8/gviz/tq?tqx=out:json");
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
                li.classList.add("item_link");
                
                if (index >= 5) {
                    li.classList.add("hidden");
                }

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

            const toggleBtn = document.getElementById("toggleBtn");
            toggleBtn.addEventListener("click", toggleList);

            // 초기 상태
            if (rows.length > 6) {
                isExpanded = false;
            } else {
                toggleBtn.style.display = 'none';
            }

        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        }
    }

    function slideDown(element, duration = 400) {
        element.classList.remove("hidden");
        element.style.display = "block";
        element.style.overflow = "hidden";
        element.style.height = "0";
        element.style.opacity = "0";
        element.style.transition = `height ${duration}ms ease-out, opacity ${duration}ms ease-out`;
        
        const scrollHeight = element.scrollHeight;
        
        setTimeout(() => {
            element.style.height = scrollHeight + "px";
            element.style.opacity = "1";
        }, 10);
    }

    function slideUp(element, duration = 400) {
        element.style.overflow = "hidden";
        element.style.height = element.scrollHeight + "px";
        element.style.opacity = "1";
        element.style.transition = `height ${duration}ms ease-in, opacity ${duration}ms ease-in`;
        
        setTimeout(() => {
            element.style.height = "0";
            element.style.opacity = "0";
        }, 10);
        
        setTimeout(() => {
            element.classList.add("hidden");
            element.style.display = "none";
            element.style.transition = "";
        }, duration);
    }

    function toggleList() {
        const toggleBtn = document.getElementById("toggleBtn");
        const allItems = document.querySelectorAll(".item_link");

        if (isExpanded) {
            // 접기
            allItems.forEach((item, index) => {
                if (index >= 5) {
                    slideUp(item, 400);
                }
            });
            toggleBtn.textContent = "더보기";
            isExpanded = false;
        } else {
            // 더보기
            allItems.forEach((item, index) => {
                if (index >= 5) {
                    slideDown(item, 400);
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

    const calendarIframe = document.querySelector('.calendar-wrapper iframe');
    
    if (calendarIframe) {
        calendarIframe.addEventListener('load', function() {
            console.log('Google Calendar loaded successfully');
        });
    }

    fetchGoogleSheetData();
});