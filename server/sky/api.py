from restapi.decorators import api
from django.views.decorators.csrf import csrf_exempt
from .models import *



@api
def load_user_data(uid):
	return {
		'a': 1
	}


@api
def save_user_data(uid, data):
	pass


@api
def add(a, b):
	return a + b


#进入游戏，是否加载剧情
@api
def get_user_plot(**params):
	res = {}
	user_name = params['user_name']
	checkpoint_id = params['level']
	plot_list = [] #存剧情
	get_user_level = 0
	if user_name:
		if checkpoint_id:
			get_user = User.objects.filter(user_id=user_name,checkpoint__checkpoint_id=checkpoint_id).first()
			if get_user:
				get_user_level = int(get_user.status) if get_user else 0
				if get_user_level >= checkpoint_id and get_user_level != 0:
					pass
				else:
					if get_user_level == 0:
						get_user_level = 1#为0表示为新手，加载第一关剧情
					get_plot = Plot.objects.filter(checkpoint_id=get_user_level).order_by('serial_number')
					for x in get_plot:
						juqi = {}
						juqi['name'] = x.plot_name
						plot_list.append(juqi)
			else:
				res['error'] = '请登录游戏!'

		else:
			get_user = User.objects.filter(user_id=user_name).first()
			if get_user:
				if get_user_level == 0:
					get_user_level = 1
				get_plot = Plot.objects.filter(checkpoint_id=get_user_level).order_by('serial_number')
				for x in get_plot:
					juqi = {}
					juqi['name'] = x.plot_name
					plot_list.append(juqi)
			else:
				res['error'] = '请登录游戏!'

	else:
		res['error']= '请登录游戏!'

	User.objects.filter(user_id=user_name).update(status=get_user_level)
	res['imgs'] = plot_list
	return res

#加载剧情
@api
def get_plot(**params):
	res = {}
	checkpoint_id = params['level']
	plot_list = [] #存剧情
	if checkpoint_id:
		get_plot = Plot.objects.filter(checkpoint_id=checkpoint_id).order_by('serial_number')
		for x in get_plot:
			juqi = {}
			juqi['name'] = x.plot_name
			plot_list.append(juqi)
	else:
		res['error'] = '请选择关卡剧情!'
	res['imgs'] = plot_list
	return res


#获取当前等级
@api
def get_user_level(**params):
 res = {}
 user_name = params['user_name']
 level = 1
 if user_name:
  user_id = User.objects.filter(user_id=user_name).first()
  if user_id:
   level = user_id.checkpoint.checkpoint_id if user_id.checkpoint else 1
  else:
   res['error'] = '请登录游戏!'
 else:
  res['error'] = '请登录游戏!'
 res['level'] = int(level) - 1

 return res


#展示所有关卡
@api
def get_level(**params):
 res = {}
 checkpoint_list = []
 checkpoint = Checkpoint.objects.all().order_by('checkpoint_id')
 for x in checkpoint:
  guanka = {}
  guanka['level_id'] = x.checkpoint_id
  guanka['level_name'] = x.checkpoint_name
  checkpoint_list.append(guanka)
 res['level_list'] = checkpoint_list
 return res
 

#通关加一级
@api
def get_user_clearance(**params):
	user_name = params['user_name']
	level = 1
	if user_name:
		get_level = User.objects.filter(user_id=user_name).first()
		if get_level:
			level = get_level.checkpoint.checkpoint_id if get_level.checkpoint else 1
		level = level + 1
		User.objects.filter(user_id=user_name).update(checkpoint__checkpoint_id=level)
	else:
		res['error'] = '请登录游戏!'
	return res

