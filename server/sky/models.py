from django.db import models


# Create your models here.
class User(models.Model):
    user_id = models.CharField(max_length=100, verbose_name='用户的唯一标识')
    name = models.CharField(max_length=100, verbose_name='用户名')
    checkpoint = models.ForeignKey('Checkpoint', on_delete=models.CASCADE, verbose_name='当前关卡', null=True)
    status = models.CharField(max_length=10, verbose_name='判断是否看过当前关卡剧情',default='0')

    class Meta(object):
        verbose_name = verbose_name_plural = '用户表'

    def __str__(self):
        return '用户名' + self.name + '当前关卡' + self.checkpoint.checkpoint_name

class Checkpoint(models.Model):
    checkpoint_id = models.CharField(max_length=100, verbose_name='关卡')
    checkpoint_name = models.CharField(max_length=100, verbose_name="关卡名")
    # plot_id = models.ForeignKey('Plot', on_delete=models.CASCADE, null=True)

    class Meta(object):
        verbose_name = verbose_name_plural = '关卡表'
    
    def __str__(self):
        return '关卡' + self.checkpoint_id + '，关卡名' + self.checkpoint_name

class Plot(models.Model):
    checkpoint_id = models.CharField(max_length=100, verbose_name='当前关卡')
    plot_name = models.CharField(max_length=100, verbose_name='图片名')
    serial_number = models.CharField(max_length=10, verbose_name='序号')
    class Meta(object):
        verbose_name = verbose_name_plural = '剧情'
    
    def __str__(self):
        return '关卡' + self.checkpoint_id + '序号' + self.serial_number + '图片名' + self.plot_name
