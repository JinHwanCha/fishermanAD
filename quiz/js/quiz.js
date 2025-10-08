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
		new Question('다음 중 이정우 목사님의 생일은?', ['3월7일', '6월16일','8월13일','12월1일'],'8월13일'),
		new Question('2025년8월29일 센터워십 설교자는 누구인가?', ['윤주남 목사님','조계웅 전도사님','이정우 목사님','연한흠 목사님'],'이정우 목사님'),
		new Question('2025년8월31일 대예배 설교 본문은?',['욥기 27장1-5절','야고보서 1장12-13절','창세기 18장17-19절','시편 126편1절'],'야고보서 1장12-13절'),
		new Question('2025년 여름수련회 주제는?', ['cost','costco','하나님의 주먹권','하나님의 꿈'],'하나님의 꿈'),
		new Question('다음 중 내수동교회 부서 명칭이 아닌 것은?', ['DREAMER','예닮이','경주자','FISHERS'],'FISHERS'),
		new Question('다음 중 청년부 마을 이름을 고르시오.', ['풍성한 마을','헤세드 마을','김향기 마을','새벽이슬 마을'],'풍성한 마을'),
		new Question('다음 중 성경에 "쉐마"의 뜻은 무엇 인가?', ['이스라엘아 들으라','다시오실 예수 그리스도','강한 용사 여호와','이스라엘 혼난다'],'이스라엘아 들으라'),
		new Question('다음 중 2025 청년부 어부들은 어디로 아웃리치를 가는가?', ['로마','튀르키예','튀르키예수','강남'],'튀르키예')
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
		} else if(per <=55) {
			txt +='<h2 style="color:red">나쁘지 않은데요?!</h2>';
		} else if(per <=70) {
			txt +='<h2 style="color:red">훌륭합니다!</h2>';
		} else if(per <=90) {
			txt +='<h2 style="color:red">꽤 많은걸 알고 있군요?</h2>';
		} else {
			txt += '<h2 style="color:red">내수동교회 어디까지 알고있니..?</h2>';
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
