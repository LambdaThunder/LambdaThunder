# Generated by Django 4.2.7 on 2023-11-28 01:10

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='YourModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('User_Number', models.IntegerField()),
                ('ID', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'User_Quiz',
                'managed': False,
            },
        ),
    ]
