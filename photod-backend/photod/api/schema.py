from django.urls import reverse

from haystack.query import SearchQuerySet
from haystack.inputs import AutoQuery

from graphene_django.filter import DjangoFilterConnectionField
from graphene_django import DjangoObjectType

from graphene import relay

from graphql_relay.node.node import from_global_id

from photod.core import models
from photod.web.views import thumbnail, media, filmstrip

import graphene
import django_filters


class MediaFileFilter(django_filters.FilterSet):
    class Meta:
        model = models.MediaFile
        fields = ["directory_id", "directory", "tag"]

    tag = django_filters.CharFilter(name='tags', method='filter_tag')

    def filter_tag(self, queryset, name, value):
        return queryset.filter(tags__label__iexact=value)


class ThumbnailFilter(django_filters.FilterSet):
    class Meta:
        model = models.Thumbnail
        fields = ["width", "height", "min_width", "min_height"]

    min_width = django_filters.NumberFilter(name='width', lookup_expr='gte')
    min_height = django_filters.NumberFilter(name='height', lookup_expr='gte')


class FilmstripFilter(django_filters.FilterSet):
    class Meta:
        model = models.Filmstrip
        fields = ["width", "height", "min_width", "min_height"]

    min_width = django_filters.NumberFilter(name='width', lookup_expr='gte')
    min_height = django_filters.NumberFilter(name='height', lookup_expr='gte')


class Tag(DjangoObjectType):
    class Meta:
        model = models.Tag
        interfaces = (relay.Node, )
        filter_fields = ['label']


class Face(DjangoObjectType):
    class Meta:
        model = models.Face
        interfaces = (relay.Node, )


class Person(DjangoObjectType):
    class Meta:
        model = models.Person
        interfaces = (relay.Node, )


class Album(DjangoObjectType):
    class Meta:
        model = models.Album
        interfaces = (relay.Node, )


class Directory(DjangoObjectType):
    class Meta:
        model = models.Directory
        interfaces = (relay.Node, )

    children_count = graphene.Int()
    media_files_count = graphene.Int()

    def resolve_children_count(self, args, context, info):
        return self.get_children_count()

    def resolve_media_files_count(self, args, context, info):
        return self.media_files.all().count()


class Thumbnail(DjangoObjectType):
    class Meta:
        model = models.Thumbnail
        interfaces = (relay.Node, )

    url = graphene.String()

    def resolve_url(self, args, context, info):
        return reverse(thumbnail, args=[self.media_file_id, self.id])


class Filmstrip(DjangoObjectType):
    class Meta:
        model = models.Filmstrip
        interfaces = (relay.Node, )

    url = graphene.String()

    def resolve_url(self, args, context, info):
        return reverse(filmstrip, args=[self.media_file_id, self.id])


class Palette(DjangoObjectType):
    class Meta:
        model = models.Palette
        interfaces = (relay.Node, )


class MediaFile(DjangoObjectType):
    class Meta:
        model = models.MediaFile
        interfaces = (relay.Node, )

    thumbnails = DjangoFilterConnectionField(
        Thumbnail, filterset_class=ThumbnailFilter)
    filmstrips = DjangoFilterConnectionField(
        Filmstrip, filterset_class=FilmstripFilter)

    url = graphene.String()

    def resolve_url(self, args, context, info):
        return reverse(media, args=[self.id])


class SearchResult(graphene.ObjectType):
    model = graphene.String()
    pk = graphene.ID()
    score = graphene.Float()
    text = graphene.String()


class Search(graphene.Mutation):
    class Input:
        query = graphene.String()

    results = graphene.List(SearchResult)

    @staticmethod
    def mutate(root, args, context, info):
        query = args.get("query", "").strip()

        # Perform the query if there is one.
        if query:
            results = SearchQuerySet().filter(content=AutoQuery(query))[:25]
        else:
            results = []

        return Search(results=[
            SearchResult(
                model=result.model_name, pk=result.pk, score=result.score,
                text=str(result.object)
            ) for result in results
        ])


class Query(graphene.ObjectType):
    node = relay.Node.Field()

    media_files = DjangoFilterConnectionField(
        MediaFile, filterset_class=MediaFileFilter)

    tags = DjangoFilterConnectionField(Tag)
    faces = DjangoFilterConnectionField(Face)
    persons = DjangoFilterConnectionField(Person)

    albums = DjangoFilterConnectionField(Album)
    directories = DjangoFilterConnectionField(
        Directory, parent_id=graphene.ID())

    def resolve_directories(self, args, context, info):
        parent_id = args.get('parent_id')

        if parent_id:
            _, parent_id = from_global_id(parent_id)

            return models.Directory.objects.get(id=parent_id).get_children()

        return models.Directory.get_root_nodes()


class Mutation(graphene.ObjectType):
    search = Search.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
