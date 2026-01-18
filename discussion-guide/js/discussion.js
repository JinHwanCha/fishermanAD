document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     페이지 진입 애니메이션
  =============================== */
  setTimeout(() => {
    document.querySelector(".wrap")?.classList.add("on");
  }, 1000);

  /* ===============================
     오늘 날짜 자동 표시
  =============================== */
  const titleEl = document.querySelector(".header_title");
  const dateEl = document.querySelector(".date");

  if (titleEl && dateEl) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

    const sunday = new Date(today);
    sunday.setDate(today.getDate() + daysUntilSunday);

    const year = sunday.getFullYear();
    const month = String(sunday.getMonth() + 1).padStart(2, "0");
    const day = String(sunday.getDate()).padStart(2, "0");

    titleEl.textContent = `${year} 내수동교회 청년부`;
    dateEl.textContent = `${year}.${month}.${day}.`;
  }

  /* ===============================
     구글 시트 데이터 불러오기
  =============================== */
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/103zpvnwBbgXOTt5hrWQxG5Duxw34hRphmHu3pMwtCZc/gviz/tq?tqx=out:json";

  fetch(sheetURL)
    .then((res) => res.text())
    .then((text) => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows;

      /* ===============================
         분류별 데이터 저장
      =============================== */
      const dataMap = {};

      rows.forEach((row) => {
        if (!row.c || row.c.length < 2) return;

        const key = row.c[0]?.v?.trim();
        const value = row.c[1]?.v?.trim();

        // 헤더 행 / 빈 행 제거
        if (
          !key ||
          !value ||
          key === "분류" ||
          key === "나눔지 상단 제목"
        ) {
          return;
        }

        if (!dataMap[key]) {
          dataMap[key] = [];
        }

        dataMap[key].push(value);
      });

      /* ===============================
         상단 예배 정보
      =============================== */
      document.querySelector(".discussion_title").textContent =
        dataMap["주일예배 제목"]?.[0] || "";

      document.querySelector(".bible_passage").textContent =
        dataMap["주일예배 말씀"]?.[0] || "";

      document.querySelector(".bible_preacher").textContent =
        dataMap["설교자"]?.[0] || "";

      /* ===============================
         본문 질문
      =============================== */
      const obsWrap = document.querySelector(".observation_questions");
      if (obsWrap && dataMap["본문 질문"]) {
        obsWrap.innerHTML = "<h4>본문 질문</h4>";
        dataMap["본문 질문"].forEach((q, i) => {
          const p = document.createElement("p");
          p.className = "question";
          p.innerHTML = `<span>${i + 1}.</span>${q}`;
          obsWrap.appendChild(p);
        });
      }

      /* ===============================
         적용 질문
      =============================== */
      const appWrap = document.querySelector(".application_questions");
      if (appWrap && dataMap["적용 질문"]) {
        appWrap.innerHTML = "<h4>적용 질문</h4>";
        dataMap["적용 질문"].forEach((q, i) => {
          const p = document.createElement("p");
          p.className = "question";
          p.innerHTML = `<span>${i + 1}.</span>${q}`;
          appWrap.appendChild(p);
        });
      }

      /* ===============================
         나눔 섹션 (제목 + 질문 유동)
      =============================== */
      const sharingTitleEl = document.querySelector(".sharing_title");
      const shareWrap = document.querySelector(".sharing_list");

      const usedKeys = [
        "주일예배 제목",
        "주일예배 말씀",
        "설교자",
        "본문 질문",
        "적용 질문",
      ];

      // 본문/적용 제외한 나머지 분류 1개 사용
      const sharingKey = Object.keys(dataMap).find(
        (key) => !usedKeys.includes(key)
      );

      if (sharingKey && sharingTitleEl && shareWrap) {
        // 분류명을 그대로 제목으로
        sharingTitleEl.textContent = sharingKey;

        // 해당 분류 질문 출력
        shareWrap.innerHTML = "";
        dataMap[sharingKey].forEach((q) => {
          const li = document.createElement("li");
          li.className = "sharing_question";
          li.textContent = q;
          shareWrap.appendChild(li);
        });
      }
    })
    .catch((err) => {
      console.error("Google Sheet Load Error:", err);
    });
});
