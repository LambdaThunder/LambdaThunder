// confirm을 사용하여 확인 버튼을 눌렀을 때 페이지를 이동시킵니다.
var userConfirmed = confirm("아이디 비밀번호가 맞지 않습니다.");
        
if (userConfirmed) {
    // 사용자가 확인 버튼을 눌렀을 때 실행될 코드
    window.history.back();
} else {
    window.history.back();
    // 사용자가 취소 버튼을 눌렀을 때 실행될 코드
    // 여기에 다른 동작을 추가할 수 있습니다.
}