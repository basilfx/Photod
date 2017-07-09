# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-08 21:14
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_mediafile_flip'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='album',
            options={'ordering': ['name']},
        ),
        migrations.AlterModelOptions(
            name='mediafile',
            options={'get_latest_by': 'modified', 'ordering': ('-modified', '-created')},
        ),
        migrations.AddField(
            model_name='mediafile',
            name='created',
            field=django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='created'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='mediafile',
            name='modified',
            field=django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified'),
        ),
        migrations.AddField(
            model_name='mediafile',
            name='recorded',
            field=models.DateTimeField(null=True),
        ),
    ]