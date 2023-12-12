from django.shortcuts import render, redirect
from django.http import JsonResponse #추가
import pymysql, logging
from django.conf import settings
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import logout
import json, base64

# Create your views here.

logger = logging.getLogger(__name__)

def index(request):
    user_id = request.session.get('userid')
    user_password = request.session.get('userpassword')
    if not (user_id and user_password):
        return redirect('login')
    return render(request, 'INFOtemp/index.html', {'user_id': user_id, 'user_password': user_password})
    
def login(request):
    return render(request, 'login/login.html')

def list(request):
    user_id = request.session.get('userid')
    user_password = request.session.get('userpassword')
    # 세션에 사용자 정보가 없으면 로그인 페이지로 리디렉션
    if not (user_id and user_password):
        return redirect('login')
    # 여기에 사용자 정보를 활용한 작업 수행
    return render(request, 'list/list.html', {'user_id': user_id, 'user_password': user_password})

def logout_view(request):
    logout(request)
    return redirect('login')

def form(request):
    return render(request, 'form/form.html')

@csrf_protect
def Insert_into_table(request):
    logger.info(request.method)
    
    if request.method == 'POST':
        nickname = request.POST.get('Nickname')
        user_id = request.POST.get('ID')
        passwd = request.POST.get('Password')
        
        logger.info(f"Received data - Nickname: {nickname}, ID: {user_id}")

        # 파라미터화된 쿼리 사용
        sql = "INSERT INTO User_table (Nickname, ID, Password, token) VALUES (%s, %s, password(%s), password(%s))"
        params = (nickname, user_id, passwd, user_id)

        database_settings = settings.DATABASES
        mysql_settings = database_settings['default']
        NAME = mysql_settings['NAME']
        USER =  mysql_settings['USER']
        PASSWORD =  mysql_settings['PASSWORD']
        HOST =  mysql_settings['HOST']

        try:
            # MySQL 연결 및 데이터베이스에 데이터 삽입
            with pymysql.connect(host=HOST, user=USER, password=PASSWORD, db=NAME, charset='utf8') as conn:
                with conn.cursor() as cursor:
                    cursor.execute(sql, params)
                    conn.commit()

            return JsonResponse({'message': 'Data inserted successfully'})
        except Exception as e:
            # 예외 처리: 데이터 삽입 실패 시
            logger.error(f'Error: {str(e)}')
            return JsonResponse({'error': 'Failed to insert data'}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_protect
def login_view(request):
    if request.method == 'POST':
        user_id = request.POST.get('ID')
        password = request.POST.get('Password')
        # RDS에 직접 연결
        database_settings = settings.DATABASES
        mysql_settings = database_settings['default']
        NAME = mysql_settings['NAME']
        USER = mysql_settings['USER']
        PASSWORD = mysql_settings['PASSWORD']
        HOST = mysql_settings['HOST']

        conn = pymysql.connect(host=HOST, user=USER, password=PASSWORD, db=NAME, charset='utf8')
        cursor = conn.cursor()

        try:
            # 사용자 정보 대조 쿼리
            sql = f"SELECT * FROM User_table WHERE ID = '{user_id}' AND Password = password('{password}')"
            cursor.execute(sql)
            result = cursor.fetchone()
            if result:
                request.session['userid'] = result[2]
                request.session['userpassword'] = result[3]
                return redirect('list')
            else:
                return JsonResponse({'error': '사용자명 또는 비밀번호가 잘못되었습니다.'}, status=400)
        except Exception as e:
            # 예외 처리
            logger.error(f"Error connecting to RDS: {str(e)}")
            return JsonResponse({'error': '서버 오류가 발생했습니다.'}, status=500)
        finally:
            # 연결 종료
            conn.close()
    return render(request, 'login/login.html')

#리스트 용 추가 함수

# mysql 에서 테이블 값을 가져오는 함수
@csrf_protect
def quiz(request):
    
    # mysql 접속 변수 선언
    database_settings = settings.DATABASES
    mysql_settings = database_settings['default']
    NAME = mysql_settings['NAME']
    USER = mysql_settings['USER']
    PASSWORD = mysql_settings['PASSWORD']
    HOST = mysql_settings['HOST']
    
    connection1 = pymysql.connect(host=HOST, user=USER, password=PASSWORD, db=NAME, charset='utf8')
    cursor = connection1.cursor()

    try:
        # Quiz_table에서 데이터 가져오기
        sql1 = "SELECT * FROM Quiz_table"
        cursor.execute(sql1) 
        quiz_data = cursor.fetchall()
    finally:
        connection1.close()

    return render(request, 'list/quiz.html', {'quiz_data': quiz_data}) # Quiz_table의 데이터 값을 list 경로의 quiz.html에 quiz_data 란 이름으로 전달

# post 형식으로 받은 데이터를 index.html로 보내는 함수
@csrf_protect
def get_parameter(request):
    if request.method == 'POST':
        quiz_id = request.POST.get('Quiz_id')

        database_settings = settings.DATABASES
        mysql_settings = database_settings['default']
        NAME = mysql_settings['NAME']
        USER =  mysql_settings['USER']
        PASSWORD =  mysql_settings['PASSWORD']
        HOST =  mysql_settings['HOST']

        conn = pymysql.connect(host=HOST, user=USER, password=PASSWORD, db=NAME, charset='utf8')
        cursor = conn.cursor()

        try:
            # 사용자 정보 대조 쿼리
            sql = f"SELECT Quizname, Quizdetail, Test_argument, Example_argument, argsnum, base_code FROM Quiz_table WHERE Quiz_Number = '{quiz_id}'"
            cursor.execute(sql)
            result = cursor.fetchone()
            if result:
                Quizname = result[0]
                Quizdetail = result[1]
                Test_argument = result[2]
                Example_argument = result[3]
                argsnum = result[4]
                base_code = result[5]

                data = {
                    'Quiz_id': quiz_id,
                    'Quizname': Quizname,
                    'Quizdetail': Quizdetail.replace("\n","<br>"),
                    'Test_argument': Test_argument,
                    'Example_argument': Example_argument,
                    'argsnum': argsnum,
                    'base_code': base64.b64encode(base_code.replace("\r","\t").encode()).decode(),
                }
                return render(request, 'INFOtemp/index.html', data)
            else:
                pass
        except Exception as e:
            logger.error(f"Error connecting to RDS: {str(e)}")
        finally:
            conn.close()
    return render(request, 'INFOtemp/index.html')

@csrf_protect
def myview(request):
    if request.method == 'POST':  
        quizName = request.POST.get('title')
        quizDetail = request.POST.get('content')
        testArgs = request.POST.get('test_args')
        exampleArgs = request.POST.get('example_args')
        base_code = request.POST.get('base_code')

        testargsnum = json.loads(testArgs)
        exampleargsnum = json.loads(exampleArgs)
        if len(testargsnum) == 5 and len(exampleargsnum) == 2 :

            if len(testargsnum[0]) == len(exampleargsnum[0]) :
                argsnum = len(testargsnum[0])

                # 파라미터화된 쿼리 사용
                sql = "INSERT INTO Quiz_table (Quizname, Quizdetail, Test_argument, Example_argument, Visibility, argsnum, base_code) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                
                # 데이터를 튜플로 묶어서 전달
                params = (quizName, quizDetail, testArgs, exampleArgs, "1", argsnum, base_code)
                database_settings = settings.DATABASES
                mysql_settings = database_settings['default']
                NAME = mysql_settings['NAME']
                USER = mysql_settings['USER']
                PASSWORD = mysql_settings['PASSWORD']
                HOST = mysql_settings['HOST']

                try:
                    # 데이터베이스 삽입 진행
                    with pymysql.connect(host=HOST, user=USER, password=PASSWORD, db=NAME, charset='utf8') as conn:
                        with conn.cursor() as cursor:
                            cursor.execute(sql, params)
                            conn.commit()
                        return JsonResponse({'message': 'Data inserted successfully'}) 
                except pymysql.Error as e:
                    # 예외 처리: 데이터 삽입 실패 시
                    logger.error(f'Error: {str(e)}')
                    return JsonResponse({'message': 'Database error occurred'}, status=500)
            else:
                return JsonResponse({'error': 'argsnum Error'}, status=400)
        else :
            return JsonResponse({'error': 'Error there need 10 Test and 3 Exam'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)