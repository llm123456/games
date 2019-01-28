from django.contrib import admin

# Register your models here.
from .models import User, Checkpoint, Plot
admin.site.register(User)
admin.site.register(Checkpoint)
admin.site.register(Plot)