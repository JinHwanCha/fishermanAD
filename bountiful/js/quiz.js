$(function(){
	//문제 객체 생성자
	function Question(text, choice, answer){
		this.text = text;
		this.choice = choice;
		this.answer = answer;
	}

	//퀴즈 객체 생성자
	function Quiz(questions){
		this.score = 0;
		this.questions = questions;
		this.questionIndex = 0;
	}

	//정답 확인 메서드
	Quiz.prototype.correctAnswer = function(answer){
		return answer == this.questions[this.questionIndex].answer;
	};

	//문제 데이터
	var questions = [
		new Question('내수동교회 본관 입당예배일은?', ['2006년11월17일', '2006년11월18일','2007년11월18일','2007년11월19일'],'2007년11월18일'),
		new Question('내수동교회 원로목사님의 성함은?', ['옥한흠 목사님','연한흠 목사님','박지웅 목사님','박희천 목사님'],'박희천 목사님'),
		new Question('다음 중 내수동교회에 없는 부서는?',['유아부','청소년부','청년부','장년부'],'청소년부'),
		new Question('다음 중 내수동교회 전화번호 뒷자리?', ['6351','6352','6531','6153'],'6351'),
		new Question('다음 중 내수동교회 파송선교사님 수는? <br>(힌트. 주보 참조)', ['15명','16명','17명','18명'],'15명'),
		new Question('이정우 목사님 친할머니의 국적은?', ['튀르키예','고려','몽골','한국'],'한국'),
		new Question('예배 전 중보기도모임 장소는 어디인가요?', ['샬롬홀','비전홀','비전센터','청년부스튜디오'],'청년부스튜디오'),
		new Question('내수동교회 카페 이름은?', ['광야의하루','에덴동산','쉴만한물가','베들레헴'],'쉴만한물가'),
		new Question('본당(본관)까지 올라가는 계단 갯수는?', ['20개','21개','22개','32개'],'22개'),
		new Question('내수동교회에서 김화수양관까지의 거리는?(직선거리)', ['84.7km','93.9km','105.2km','114.3km'],'84.7km')
	];

	var quiz = new Quiz(questions);

	//문제 출력 함수
	function update_quiz(){
		var $question = $('#question');
		var idx = quiz.questionIndex + 1;
		$question.html('Q'+ idx + '<br> ' + quiz.questions[quiz.questionIndex].text);

		// ✅ 버튼을 완전히 새로 그리기 (hover 잔상 초기화 핵심)
		var buttonsHtml = '';
		for (var i = 0; i < 4; i++) {
			buttonsHtml += '<button class="btn">'+ quiz.questions[quiz.questionIndex].choice[i] +'</button>';
		}
		$('.buttons').html(buttonsHtml);

		// 이벤트 다시 바인딩
		$('.btn').each(function(){
			const $btn = $(this);

			// 클릭 시 정답 처리
			$btn.on('click', handleAnswer);

			// 💡 모바일 터치 시 hover 효과 흉내내기
			$btn.on('touchstart', function(){
				$btn.addClass('touch-hover');
			});

			$btn.on('touchend touchcancel', function(){
				$btn.removeClass('touch-hover');
			});
		});

		progress();
	}

	//진행 표시
	function progress() {
		$('#progress').html((quiz.questionIndex+1)+"/"+quiz.questions.length);
	}

	//결과 출력
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

	//정답 처리 함수
	function handleAnswer(){
		// 문제 이동 시 모든 버튼의 hover 상태 제거
		$('.btn').removeClass('touch-hover');

		var $answer = $(this).text();

		// 포커스, hover 제거
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

	update_quiz();
});
