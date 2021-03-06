from django.urls import reverse
from django.shortcuts import get_object_or_404
from django.db.models import IntegerField, Case, Value, When
from django.contrib.auth import get_user_model

from haystack.query import SearchQuerySet

from haystack_queryparser import ParseSQ, QueryParserException

from graphene_django.filter import DjangoFilterConnectionField
from graphene_django import DjangoObjectType

from graphene import relay

from graphql_relay.node.node import from_global_id

from photod.core import models
from photod.cli import models as cli_models
from photod.web.views import thumbnail, media, filmstrip, share

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
                orderings += ["%s_ordered" % field, "-%s" % field]

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
        fields = [
            "albums__id", "faces__person__id", "directory_id", "directory",
            "tag"]

    tag = django_filters.CharFilter(method="filter_tag")

    has_views = django_filters.BooleanFilter(method="filter_has_views")
    is_shared = django_filters.BooleanFilter(method="filter_is_shared")
    is_starred = django_filters.BooleanFilter(method="filter_is_starred")

    def filter_tag(self, queryset, name, value):
        return queryset.filter(tags__label__iexact=value)

    def filter_has_views(self, queryset, name, value):
        if value:
            queryset = queryset.filter(views__isnull=False, views__count__gt=0)
        return queryset

    def filter_is_shared(self, queryset, name, value):
        if value:
            queryset = queryset.filter(
                shared__isnull=False, shared__user=self.request.user)
        return queryset

    def filter_is_starred(self, queryset, name, value):
        if value:
            queryset = queryset.filter(
                stars__isnull=False, stars__user=self.request.user)
        return queryset


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


class Text(DjangoObjectType):
    class Meta:
        model = models.Text
        interfaces = (relay.Node, )


class Person(DjangoObjectType):
    class Meta:
        model = models.Person
        interfaces = (relay.Node, )

    faces_count = graphene.Int()

    def resolve_faces_count(self, args, context, info):
        return self.faces.count()


class Album(DjangoObjectType):
    class Meta:
        model = models.Album
        interfaces = (relay.Node, )

    children = DjangoFilterConnectionField(lambda: Album)

    children_count = graphene.Int()
    total_children_count = graphene.Int()
    media_files_count = graphene.Int()
    total_media_files_count = graphene.Int()

    def resolve_children(self, args, context, info):
        return self.get_children()

    def resolve_children_count(self, args, context, info):
        return self.get_children_count()

    def resolve_total_children_count(self, args, context, info):
        return models.Album.objects.filter(
            path__startswith=self.path
        ).count()

    def resolve_media_files_count(self, args, context, info):
        return self.media_files.count()

    def resolve_total_media_files_count(self, args, context, info):
        return models.MediaFile.objects.filter(
            albums__path__startswith=self.path
        ).count()


class Directory(DjangoObjectType):
    class Meta:
        model = models.Directory
        interfaces = (relay.Node, )

    children = DjangoFilterConnectionField(lambda: Directory)

    children_count = graphene.Int()
    total_children_count = graphene.Int()
    media_files_count = graphene.Int()
    total_media_files_count = graphene.Int()

    def resolve_children(self, args, context, info):
        return self.get_children()

    def resolve_children_count(self, args, context, info):
        return self.get_children_count()

    def resolve_total_children_count(self, args, context, info):
        return models.Directory.objects.filter(
            path__startswith=self.path
        ).count()

    def resolve_media_files_count(self, args, context, info):
        return self.media_files.count()

    def resolve_total_media_files_count(self, args, context, info):
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

    faces_count = graphene.Int()
    locations_count = graphene.Int()

    starred = graphene.Boolean()

    def resolve_url(self, args, context, info):
        return reverse(media, args=[self.id])

    def resolve_faces_count(self, args, context, info):
        return self.faces.count()

    def resolve_locations_count(self, args, context, info):
        return self.locations.count()

    def resolve_starred(self, args, context, info):
        return self.stars.filter(user=context.user).exists()


class User(DjangoObjectType):
    class Meta:
        model = get_user_model()
        exclude_fields = ('password', )
        interfaces = (relay.Node, )


class Share(DjangoObjectType):
    class Meta:
        model = models.Share
        interfaces = (relay.Node, )

    url = graphene.String()

    def resolve_url(self, args, context, info):
        return reverse(share, args=[self.token])


class Job(DjangoObjectType):
    class Meta:
        model = cli_models.Job
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
            try:
                results = SearchQuerySet().filter(ParseSQ().parse(query))[:25]
            except QueryParserException:
                results = []
        else:
            results = []

        return Search(results=[
            SearchResult(
                model=result.model_name, pk=result.pk, score=result.score,
                text=str(result.object)
            ) for result in results
        ])


class View(graphene.Mutation):
    class Input:
        id = graphene.ID()

    count = graphene.Int()

    @staticmethod
    def mutate(root, args, context, info):
        media_file = get_object_or_404(models.MediaFile, args.get("id"))

        view, created = models.View.get_or_create(
            media_file=media_file, user=context.user)
        view.count += 1
        view.save()

        return View(result=view.count)


class Star(graphene.Mutation):
    class Input:
        id = graphene.ID(description="Identifier of media file.")
        star = graphene.Boolean(description="True if star should be added.")

    star = graphene.Boolean()

    @staticmethod
    def mutate(root, args, context, info):
        media_file = get_object_or_404(models.MediaFile, args.get("id"))

        if args.get("star"):
            star, _ = models.Star.get_or_create(
                media_file=media_file, user=context.user)
        else:
            models.Star.filter(
                media_file=media_file, user=context.user).delete()

        return Star(bool(args.get("star")))


class Query(graphene.ObjectType):
    node = relay.Node.Field()

    media_file = relay.Node.Field(MediaFile)
    media_files = DjangoFilterConnectionField(
        MediaFile, filterset_class=MediaFileFilter)

    tag = relay.Node.Field(Tag)
    tags = DjangoFilterConnectionField(Tag)

    faces = DjangoFilterConnectionField(Face)

    person = relay.Node.Field(Person)
    persons = DjangoFilterConnectionField(Person)

    album = relay.Node.Field(Album)
    albums = DjangoFilterConnectionField(Album, parent_id=graphene.ID())

    directory = relay.Node.Field(Directory)
    directories = DjangoFilterConnectionField(
        Directory, parent_id=graphene.ID(), collapse=graphene.Boolean())

    shares = DjangoFilterConnectionField(Share)

    jobs = DjangoFilterConnectionField(Job)

    me = graphene.Field(User)

    def resolve_albums(self, args, context, info):
        parent_id = args.get('parent_id')

        if parent_id:
            _, parent_id = from_global_id(parent_id)

            return models.Album.objects.get(id=parent_id) \
                .get_children()

        return models.Album.get_root_nodes()

    def resolve_directories(self, args, context, info):
        parent_id = args.get('parent_id')
        collapse = args.get('collapse')

        def _retrieve(parent_id):
            if parent_id:
                _, parent_id = from_global_id(parent_id)

                return models.Directory.objects.get(id=parent_id) \
                    .get_children()

            return models.Directory.get_root_nodes()

        if collapse:
            return models.Directory.collapse(_retrieve(parent_id))
        else:
            return _retrieve(parent_id)

    def resolve_jobs(self, args, context, info):
        return cli_models.Job.objects.filter(state="busy")

    def resolve_me(self, args, context, info):
        return context.user


class Mutation(graphene.ObjectType):
    search = Search.Field()

    star = Star.Field()
    view = View.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
