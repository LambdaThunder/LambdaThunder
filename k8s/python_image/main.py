from test import main                           
import io                                       
import sys                                      
import json                                     
import os                                       
                                                
#환경변수 로드
arg = os.environ.get('ARGS')
answer = os.environ.get('ANSWER')
json_arg = json.loads(arg.replace("'","\""))

#출력 캐치
captured_output = io.StringIO()
sys.stdout = captured_output

#함수 불러와서 실행
try :
    return_output = main(*json_arg)
except Exception as e :
    return_output = e

#돌려놓기 (필요없나?)
sys.stdout = sys.__stdout__
print_output = captured_output.getvalue()

#채점
correct = str(return_output)==answer

#json 패키징
data = {
    "Print" : print_output,
    "Return" : str(return_output),
    "Solution" : answer,
    "Win" : correct
}

json_string = json.dumps(data)

print(json_string)                        