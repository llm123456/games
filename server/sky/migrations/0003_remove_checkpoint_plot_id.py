# Generated by Django 2.1.4 on 2019-01-28 06:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sky', '0002_checkpoint_plot_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='checkpoint',
            name='plot_id',
        ),
    ]
