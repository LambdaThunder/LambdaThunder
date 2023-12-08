list2.html
로그인 후 보여지는 메인화면 페이지
21번 줄 수정, 문제 목록으로 이동하는 부분 추가

index.html
코드를 입력 가능한 모나코 에디터 페이지
89~93번 줄 수정, 문제 제목과 문제 내용을 가져오는 부분과 메인페이지로 돌아가는 부분 추가

urls.py
views.py 함수 선언용 urls.py
13, 14번 줄 수정, 테이블 데이터를 가져오는 views.quiz 함수와 받은 post 형태의 데이터를 index.html 페이지로 전달하는 views.get_parameter 함수 선언

views.py
테이블 데이터를 전달하는 함수가 선언 된 views.py
121~165 줄 추가, mysql 에서 테이블 값을 가져오는 함수와 post 형식으로 받은 데이터를 index.html로 보내는 함수

quiz.html
문제 리스트를 10개 마다 1페이지로 표시하는 동적 페이지