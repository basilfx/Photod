from django.urls import reverse
from django.db.models import IntegerField, Case, Value, When
from django.contrib.auth import get_user_model

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
import json


class ProfileFilter(django_filters.Filter):
    def filter(self, queryset, value):
        profile = json.loads(value)

        annotations = {}
        orderings = []

        # Perform greater-than-equal lookup on width, height and quality.
        for field in ("width", "height", "quality"):
            if field in profile:
                annotations["%s_ordered" % field] = Case(
                    When(**{
                        ("%s__gte" % field): profile[field], "then": Value(0)
                    }),
                    default=Value(1),
                    output_field=IntegerField()
                )
                orderings += ["%s_ordered" % field, field]

        # Perform inclusion of MIME type.
        if "mimeType" in profile:
            annotations["mime_type_ordered"] = Case(
                *[
                    When(mime_type=mime_type, then=Value(index))
                    for index, mime_type in enumerate(profile["mimeType"])
                ],
                default=Value(len(profile["mimeType"])),
                output_field=IntegerField()
            )
            orderings += ["mime_type_ordered"]

        return queryset.annotate(**annotations).order_by(*orderings)


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
        fields = ["profile"]

    profile = ProfileFilter()


class FilmstripFilter(django_filters.FilterSet):
    class Meta:
        model = models.Filmstrip
        fields = ["profile"]

    profile = ProfileFilter()


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
        return models.MediaFile.objects.filter(
            directory__path__startswith=self.path
        ).count()


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


class User(DjangoObjectType):
    class Meta:
        model = get_user_model()
        exclude_fields = ('password', )
        interfaces = (relay.Node, )


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

    me = graphene.Field(User)

    def resolve_directories(self, args, context, info):
        parent_id = args.get('parent_id')

        if parent_id:
            _, parent_id = from_global_id(parent_id)

            return models.Directory.objects.get(id=parent_id).get_children()

        return models.Directory.get_root_nodes()

    def resolve_me(self, args, context, info):
        return context.user


class Mutation(graphene.ObjectType):
    search = Search.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
