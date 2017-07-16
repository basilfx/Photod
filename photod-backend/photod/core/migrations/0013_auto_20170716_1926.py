# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-16 19:26
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0012_mediafilestep_result'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='star',
            unique_together=set([('media_file', 'user')]),
        ),
        migrations.AlterUniqueTogether(
            name='view',
            unique_together=set([('media_file', 'user')]),
        ),
    ]