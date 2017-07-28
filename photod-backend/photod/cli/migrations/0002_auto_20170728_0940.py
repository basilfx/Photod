# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-28 09:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cli', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='state',
            field=models.CharField(choices=[('busy', 'Busy'), ('done', 'Done')], default='busy', max_length=32),
        ),
    ]