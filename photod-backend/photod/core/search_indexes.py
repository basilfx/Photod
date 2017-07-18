from haystack import indexes

from photod.core.models import MediaFile, Tag, Person, Album, Directory


class MediaFileIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.EdgeNgramField(
        document=True, use_template=True,
        template_name="search/media_file.txt")

    recorded = indexes.DateTimeField(model_attr="recorded", null=True)
    location = indexes.LocationField(null=True)

    def get_model(self):
        return MediaFile

    def prepare_location(self, instance):
        location = instance.locations.first()

        if location:
            return "%s,%s" % (location.point.y, location.point.x)


class TagIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.EdgeNgramField(
        document=True, use_template=True, template_name="search/tag.txt")

    def get_model(self):
        return Tag


class PersonIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.EdgeNgramField(
        document=True, use_template=True, template_name="search/person.txt")

    def get_model(self):
        return Person


class AlbumIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.EdgeNgramField(
        document=True, use_template=True, template_name="search/album.txt")

    def get_model(self):
        return Album


class DirectoryIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(
        document=True, use_template=True, template_name="search/directory.txt")

    def get_model(self):
        return Directory
