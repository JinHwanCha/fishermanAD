document.addEventListener("DOMContentLoaded", () => {

    // 스프레드시트 숫자/날짜 → 문자열 변환
    function formatValue(value) {
        if (typeof value === "number") {
            // 스프레드시트 일련번호 → JS Date
            const jsDate = new Date(Math.round((value - 25569) * 86400 * 1000));
            const yyyy = jsDate.getFullYear();
            const mm = String(jsDate.getMonth() + 1).padStart(2, "0");
            const dd = String(jsDate.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        } else if (typeof value === "string") {
            return value;
        } else {
            return "";
        }
    }

    async function fetchGoogleSheetQuiz() {
        try {
            const response = await fetch("https://docs.google.com/spreadsheets/d/1vIxX_SoLZl2reBnq8Cxu1MHkQEmijQGZxus7hkzxpvA/gviz/tq?tqx=out:json");
            const text = await response.text();

            const json = JSON.parse(text.substring(47, text.length - 2));
            const rows = json.table.rows;

            const questions = rows.map(row => {
                return {
                    text: formatValue(row.c[0]?.v),
                    choice: [
                        formatValue(row.c[1]?.v),
                        formatValue(row.c[2]?.v),
                        formatValue(row.c[3]?.v),
                        formatValue(row.c[4]?.v)
                    ],
                    answer: formatValue(row.c[5]?.v)
                };
            });

            startQuiz(questions);

        } catch (err) {
            console.error("데이터를 불러오는 중 오류 발생:", err);
            document.getElementById('quiz').innerHTML = "<p>⚠ 데이터를 불러오지 못했습니다.</p>";
        }
    }

    function startQuiz(questions) {
        let score = 0;
        let questionIndex = 0;

        const $question = document.getElementById('question');
        const $progress = document.getElementById('progress');
        const $buttons = document.querySelectorAll('.btn');

        function updateQuiz() {
            const q = questions[questionIndex];
            $question.innerHTML = `문제 ${questionIndex + 1}) ${q.text}`;
            $buttons.forEach((btn, i) => {
                btn.textContent = q.choice[i];
            });
            $progress.textContent = `문제 ${questionIndex + 1} / ${questions.length}`;
        }

        function showResult() {
            const per = parseInt((score * 100) / questions.length);
            let txt = `<h1>결과</h1><h2 id="score">당신의 점수: ${score}/${questions.length}<br>${per}점</h2>`;

            if (per < 40) txt += '<h2 style="color:red">좀 더 분발하세요!</h2>';
            else if (per <= 55) txt += '<h2 style="color:red">나쁘지 않네요!</h2>';
            else if (per <= 70) txt += '<h2 style="color:red">훌륭합니다!</h2>';
            else if (per <= 90) txt += '<h2 style="color:red">꽤 많이 알고 있네요!</h2>';
            else txt += '<h2 style="color:red">내수동교회 어디까지 알고 있나요..?</h2>';

            document.getElementById('quiz').innerHTML = txt;
        }

        $buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const q = questions[questionIndex];
                if (btn.textContent === q.answer) score++;
                else alert('틀렸습니다!');

                questionIndex++;
                if (questionIndex < questions.length) updateQuiz();
                else showResult();
            });
        });

        updateQuiz();
    }

    fetchGoogleSheetQuiz();
});
