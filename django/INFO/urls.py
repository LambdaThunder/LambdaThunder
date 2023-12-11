from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    path('', views.login, name="login"),
    path('index/', views.index, name="index"),
    path('Insert_into_table/', views.Insert_into_table, name='Insert_into_table'),
    path('login_view/', views.login_view, name="login_view"),
    path('list/', views.list, name="list"),
    path('logout/', views.logout_view, name='logout'),
    path('quiz/', views.quiz, name='quiz'), # quiz 함수 선언, quiz 로 호출하고 quiz 로 내보냄
    path('index', views.get_parameter, name='parameter'), # get_parameter 함수 선언, parameter 로 호출하고 index 로 내보냄
    path('form/', views.form, name="form"),
    path('myview/', views.myview, name='myview'),
]

