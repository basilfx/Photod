# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-19 20:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_auto_20170718_2102'),
    ]

    operations = [
        migrations.AddField(
            model_name='mediafilestep',
            name='version',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='mediafile',
            name='version',
            field=models.IntegerField(default=1),
        ),
    ]