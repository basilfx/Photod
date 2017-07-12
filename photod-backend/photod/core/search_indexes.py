from haystack import indexes

from photod.core.models import MediaFile, Tag, Person

import datetime


class MediaFileIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)

    path = indexes.CharField(model_attr='path')
    mime_type = indexes.CharField(model_attr='mime_type')

    recorded = indexes.DateTimeField(model_attr='recorded')

    def get_model(self):
        return MediaFile

    def index_queryset(self, using=None):
        return self.get_model().objects.filter(
            created__lte=datetime.datetime.now()
        )


class TagIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    label = indexes.CharField(model_attr='label')

    def get_model(self):
        return Tag

    def index_queryset(self, using=None):
        return self.get_model().objects.all()


class PersonIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    name = indexes.CharField(model_attr='name')

    def get_model(self):
        return Person

    def index_queryset(self, using=None):
        return self.get_model().objects.all()
