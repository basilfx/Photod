# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-06-15 17:07
from __future__ import unicode_literals

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(max_length=255, unique=True)),
                ('depth', models.PositiveIntegerField()),
                ('numchild', models.PositiveIntegerField(default=0)),
                ('name', models.CharField(max_length=255)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Directory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(max_length=255, unique=True)),
                ('depth', models.PositiveIntegerField()),
                ('numchild', models.PositiveIntegerField(default=0)),
                ('full_path', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Face',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(max_length=255)),
                ('x1', models.FloatField()),
                ('y1', models.FloatField()),
                ('x2', models.FloatField()),
                ('y2', models.FloatField()),
                ('is_confirmed', models.BooleanField(default=False)),
                ('is_ignored', models.BooleanField(default=False)),
                ('is_manual', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Filmstrip',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(max_length=255)),
                ('frames', models.IntegerField()),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('quality', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='MediaFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(max_length=255)),
                ('mime_type', models.CharField(max_length=255)),
                ('digest', models.CharField(max_length=255)),
                ('version', models.IntegerField(default=0)),
                ('file_size', models.IntegerField(null=True)),
                ('width', models.IntegerField(null=True)),
                ('height', models.IntegerField(null=True)),
                ('aspect_ratio', models.FloatField(null=True)),
                ('directory', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='media_files', to='core.Directory')),
            ],
        ),
        migrations.CreateModel(
            name='MediaFileStep',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duration', models.FloatField()),
                ('media_file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.MediaFile')),
            ],
        ),
        migrations.CreateModel(
            name='Palette',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('color', models.CharField(max_length=64)),
                ('prominence', models.FloatField()),
                ('classified_color', models.CharField(max_length=64)),
                ('media_file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='palette', to='core.MediaFile')),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Stream',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('aspect_ratio', models.FloatField()),
                ('media_file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='streams', to='core.MediaFile')),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=255, unique=True)),
            ],
            options={
                'ordering': ['label'],
            },
        ),
        migrations.CreateModel(
            name='Text',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x1', models.FloatField()),
                ('y1', models.FloatField()),
                ('x2', models.FloatField()),
                ('y2', models.FloatField()),
                ('content', models.CharField(max_length=1024)),
                ('confidence', models.FloatField()),
                ('media_file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='texts', to='core.MediaFile')),
            ],
        ),
        migrations.CreateModel(
            name='Thumbnail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(max_length=255)),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('quality', models.IntegerField()),
                ('media_file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='thumbnails', to='core.MediaFile')),
            ],
        ),
        migrations.AddField(
            model_name='mediafilestep',
            name='step',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Step'),
        ),
        migrations.AddField(
            model_name='mediafile',
            name='steps',
            field=models.ManyToManyField(related_name='media_files', through='core.MediaFileStep', to='core.Step'),
        ),
        migrations.AddField(
            model_name='mediafile',
            name='tags',
            field=models.ManyToManyField(to='core.Tag'),
        ),
        migrations.AddField(
            model_name='location',
            name='media_file',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.MediaFile'),
        ),
        migrations.AddField(
            model_name='filmstrip',
            name='media_file',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='filmstrips', to='core.MediaFile'),
        ),
        migrations.AddField(
            model_name='face',
            name='media_file',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='faces', to='core.MediaFile'),
        ),
        migrations.AddField(
            model_name='face',
            name='person',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Person'),
        ),
    ]
