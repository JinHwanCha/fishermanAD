document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelector('.wrap').classList.add('on');
    }, 1000);
// 오늘 날짜 자동 표시
  const dateEl = document.querySelector(".date");
  if (dateEl) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dateEl.textContent = `${year}.${month}.${day}.`;
  }

  // 구글 시트 데이터 불러오기
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/103zpvnwBbgXOTt5hrWQxG5Duxw34hRphmHu3pMwtCZc/gviz/tq?tqx=out:json";

  fetch(sheetURL)
    .then((res) => res.text())
    .then((text) => {
      // Google Sheets JSON 파싱
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows;

      // 데이터 누적용 객체
      const dataMap = {
        "주일예배 제목": [],
        "주일예배 말씀": [],
        "설교자": [],
        "본문 질문": [],
        "적용 질문": [],
        "여름수련회 후속 나눔": [],
      };

      // 각 행을 돌면서 key-value 분류
      rows.forEach((row) => {
        const key = row.c[0]?.v?.trim();
        const value = row.c[1]?.v?.trim();
        if (key && value && dataMap[key] !== undefined) {
          dataMap[key].push(value);
        }
      });

      // 데이터 주입
      document.querySelector(".discussion_title").textContent =
        dataMap["주일예배 제목"][0] || "";
      document.querySelector(".bible_passage").textContent =
        dataMap["주일예배 말씀"][0] || "";
      document.querySelector(".bible_preacher").textContent =
        dataMap["설교자"][0] || "";

      // 본문 질문 추가 (.observation_questions .question)
      const obsWrap = document.querySelector(".observation_questions");
      if (obsWrap && dataMap["본문 질문"].length > 0) {
        obsWrap.innerHTML = "<h4>본문 질문</h4>"; // 기존 내용 초기화
        dataMap["본문 질문"].forEach((q, i) => {
          const p = document.createElement("p");
          p.className = "question";
          p.innerHTML = `<span>${i + 1}.</span>${q}`;
          obsWrap.appendChild(p);
        });
      }

      // 적용 질문 추가 (.application_questions .question)
      const appWrap = document.querySelector(".application_questions");
      if (appWrap && dataMap["적용 질문"].length > 0) {
        appWrap.innerHTML = "<h4>적용 질문</h4>";
        dataMap["적용 질문"].forEach((q, i) => {
          const p = document.createElement("p");
          p.className = "question";
          p.innerHTML = `<span>${i + 1}.</span>${q}`;
          appWrap.appendChild(p);
        });
      }

      // 여름수련회 후속 나눔 (.sharing_question)
      const shareWrap = document.querySelector(".sharing_list");
      if (shareWrap && dataMap["여름수련회 후속 나눔"].length > 0) {
        shareWrap.innerHTML = ""; // 기존 <li> 초기화
        dataMap["여름수련회 후속 나눔"].forEach((q) => {
          const li = document.createElement("li");
          li.className = "sharing_question";
          li.textContent = q;
          shareWrap.appendChild(li);
        });
      }
    })
    .catch((err) => console.error("Google Sheet Load Error:", err));
});

