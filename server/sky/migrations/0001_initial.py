# Generated by Django 2.1.4 on 2019-01-28 03:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Checkpoint',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('checkpoint_id', models.CharField(max_length=100, verbose_name='关卡')),
                ('checkpoint_name', models.CharField(max_length=100, verbose_name='关卡名')),
            ],
            options={
                'verbose_name': '关卡表',
                'verbose_name_plural': '关卡表',
            },
        ),
        migrations.CreateModel(
            name='Plot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('checkpoint_id', models.CharField(max_length=100, verbose_name='当前关卡')),
                ('plot_name', models.CharField(max_length=100, verbose_name='图片名')),
                ('serial_number', models.CharField(max_length=10, verbose_name='序号')),
            ],
            options={
                'verbose_name': '剧情',
                'verbose_name_plural': '剧情',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=100, verbose_name='用户的唯一标识')),
                ('name', models.CharField(max_length=100, verbose_name='用户名')),
                ('status', models.CharField(default='0', max_length=10, verbose_name='判断是否看过当前关卡剧情')),
                ('checkpoint', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='sky.Checkpoint', verbose_name='当前关卡')),
            ],
            options={
                'verbose_name': '用户表',
                'verbose_name_plural': '用户表',
            },
        ),
    ]