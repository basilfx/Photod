# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-13 18:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_auto_20170713_1713'),
    ]

    operations = [
        migrations.AddField(
            model_name='mediafilestep',
            name='result',
            field=models.CharField(choices=[('success', 'Success'), ('skipped', 'Skipped'), ('failed', 'Failed')], default='success', max_length=32),
            preserve_default=False,
        ),
    ]
