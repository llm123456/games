# Generated by Django 2.1.4 on 2019-01-28 06:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sky', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='checkpoint',
            name='plot_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='sky.Plot'),
        ),
    ]