from django.conf.urls import url
from django.conf import settings

from django.views.decorators.csrf import csrf_exempt

from graphene_django.views import GraphQLView


urlpatterns = [
    url(r'^graphql', csrf_exempt(
        GraphQLView.as_view(graphiql=settings.DEBUG)
    )),
]
