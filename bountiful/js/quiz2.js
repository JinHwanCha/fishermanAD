$(function(){

    // 문제 객체 생성자
    function Question(text, choice, answer){
        this.text = text;
        this.choice = choice;
        this.answer = answer;
    }

    // 퀴즈 객체 생성자
    function Quiz(questions){
        this.score = 0;
        this.questions = questions;
        this.questionIndex = 0;
    }

    // 정답 확인 메서드
    Quiz.prototype.correctAnswer = function(answer){
        return answer == this.questions[this.questionIndex].answer;
    };

    // ✅ 구글 시트 데이터 불러오기
    async function fetchQuizData() {
        const sheetURL = "https://docs.google.com/spreadsheets/d/1Mz9c4pAgtANGVOB-XTewj0xbnqUtKGaStmmmg89sqqo/gviz/tq?tqx=out:json";
        try {
            const response = await fetch(sheetURL);
            const text = await response.text();

            // JSON 파싱
            const json = JSON.parse(text.substr(47).slice(0, -2));
            const rows = json.table.rows;

            // 시트 데이터 → Question 객체 배열로 변환
            const questions = rows.map(r => {
                const q = r.c.map(c => (c ? c.v : "")); // null 방지
                return new Question(q[0], [q[1], q[2], q[3], q[4]], q[5]);
            });

            startQuiz(questions);
        } catch (e) {
            console.error("❌ 구글 시트 데이터를 불러오는 중 오류 발생:", e);
            alert("퀴즈 데이터를 불러올 수 없습니다. 관리자에게 문의하세요.");
        }
    }

    // ✅ 퀴즈 시작 함수
    function startQuiz(questions) {
        var quiz = new Quiz(questions);

        function update_quiz(){
            var $question = $('#question');
            var idx = quiz.questionIndex + 1;
            $question.html('Q'+ idx + '<br>' + quiz.questions[quiz.questionIndex].text);

            // 버튼 다시 생성
            var buttonsHtml = '';
            for (var i = 0; i < 4; i++) {
                buttonsHtml += '<button class="btn">'+ quiz.questions[quiz.questionIndex].choice[i] +'</button>';
            }
            $('.buttons').html(buttonsHtml);

            // 이벤트 바인딩
            $('.btn').each(function(){
                const $btn = $(this);
                $btn.on('click', handleAnswer);
                $btn.on('touchstart', function(){ $btn.addClass('touch-hover'); });
                $btn.on('touchend touchcancel', function(){ $btn.removeClass('touch-hover'); });
            });

            progress();
        }

        function progress() {
            $('#progress').html((quiz.questionIndex+1)+"/"+quiz.questions.length);
        }

        function result(){
            var $quiz = $('#quiz');
            var per = parseInt((quiz.score*100)/quiz.questions.length);
            var txt = '<h1>결과</h1><h2 id="score">당신의 점수: '+quiz.score+'/'+quiz.questions.length+'<br>'+per+'점</h2>';

            if(per<40){
                txt +='<h2 style="color:red">좀더 분발하시길ㅎ</h2>';
            } else if(per <=70) {
                txt +='<h2 style="color:red">나쁘지 않은데요?!</h2>';
            } else if(per <=80) {
                txt +='<h2 style="color:red">훌륭합니다!</h2>';
            } else if(per <=90) {
                txt +='<h2 style="color:red">아쉬워요ㅠㅠ 다시 도전?</h2>';
            } else {
                txt += '<h2 style="color:red">축하드립니다🎉🎉 <br>마을톡방에 캡쳐&공유!!</h2>';
            }
            $quiz.html(txt);
        }

        function handleAnswer(){
            $('.btn').removeClass('touch-hover');
            var $answer = $(this).text();
            $(this).blur();

            if (quiz.correctAnswer($answer)){
                quiz.score++;
            } else {
                alert('틀렸습니다!');
            }

            if (quiz.questionIndex < quiz.questions.length-1){
                quiz.questionIndex++;
                update_quiz();
            } else {
                result();
            }
        }

        // 첫 문제 출력
        update_quiz();
    }

    // 🚀 실행
    fetchQuizData();
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelector('.quiz').classList.add('on');
    }, 1000);
});