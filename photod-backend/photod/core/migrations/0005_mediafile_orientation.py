# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-04 17:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_auto_20170704_1726'),
    ]

    operations = [
        migrations.AddField(
            model_name='mediafile',
            name='orientation',
            field=models.IntegerField(null=True),
        ),
    ]
