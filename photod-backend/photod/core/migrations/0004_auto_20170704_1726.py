# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-04 17:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20170703_2002'),
    ]

    operations = [
        migrations.AddField(
            model_name='filmstrip',
            name='mime_type',
            field=models.CharField(default='image/jpeg', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='thumbnail',
            name='mime_type',
            field=models.CharField(default='image/jpeg', max_length=255),
            preserve_default=False,
        ),
    ]
