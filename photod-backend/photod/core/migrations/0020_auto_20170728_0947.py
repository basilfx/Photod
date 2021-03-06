# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-28 09:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0019_auto_20170728_0941'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mediafile',
            name='albums',
            field=models.ManyToManyField(related_name='media_files', to='core.Album'),
        ),
        migrations.AlterField(
            model_name='mediafile',
            name='tags',
            field=models.ManyToManyField(related_name='media_files', to='core.Tag'),
        ),
    ]
