from django.conf.urls import url

from photod.web.views import index, login, logout, media, thumbnail, filmstrip


urlpatterns = [
    url(r'^mediafiles/([0-9a-zA-Z]+)/filmstrips/([0-9a-zA-Z]+)/$', filmstrip),
    url(r'^mediafiles/([0-9a-zA-Z]+)/thumbnails/([0-9a-zA-Z]+)/$', thumbnail),
    url(r'^mediafiles/([0-9a-zA-Z]+)/$', media),

    url(r'^login$', login),
    url(r'^logout$', logout),

    url(r'^$', index),
    url(r'^(?:.*)/?$', index),
]
