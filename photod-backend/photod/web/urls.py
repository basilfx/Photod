from django.conf.urls import url

from photod.web.views import index, login, logout, image, thumbnail, filmstrip


urlpatterns = [
    url(r'^media/([0-9a-zA-Z]+)/filmstrip/([0-9a-zA-Z]+)/$', filmstrip),
    url(r'^media/([0-9a-zA-Z]+)/thumbnail/([0-9a-zA-Z]+)/$', thumbnail),
    url(r'^media/([0-9a-zA-Z]+)/$', image),

    url(r'^login$', login),
    url(r'^logout$', logout),

    url(r'^$', index),
    url(r'^(?:.*)/?$', index),
]
