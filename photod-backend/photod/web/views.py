from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.http import is_safe_url
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.decorators import login_required
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib.auth import REDIRECT_FIELD_NAME

from photod.core.models import MediaFile, Thumbnail, Filmstrip, Share
from photod.web.forms import RememberMeAuthenticationForm

from sendfile import sendfile

import os
import json
import datetime


@login_required
def index(request):
    return render(request, "index.html", {
        'settings': settings,
        'user': json.dumps({
            'username': request.user.username,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name
        }) if request.user else None
    })


@csrf_exempt
def login(request):
    # Verify redirect URL
    redirect_to = request.POST.get(REDIRECT_FIELD_NAME) or \
        request.GET.get(REDIRECT_FIELD_NAME)
    safe_url = is_safe_url(url=redirect_to, host=request.get_host())

    if not redirect_to or not safe_url:
        redirect_to = settings.LOGIN_REDIRECT_URL

    # Process post request
    form = RememberMeAuthenticationForm(data=request.POST or None)

    if request.method == "POST":
        if form.is_valid():
            if not form.cleaned_data.get('remember'):
                request.session.set_expiry(0)

            auth_login(request, form.get_user())

            if request.session.test_cookie_worked():
                request.session.delete_test_cookie()

            return JsonResponse({
                "ok": True,
                "next": redirect_to,
            })
        else:
            return JsonResponse({
                "ok": False,
            })
    else:
        request.session.set_test_cookie()

    # Default is to show login form.
    return render(request, "index.html", {
        "settings": settings,
        "form": form,
    })


def logout(request):
    auth_logout(request)

    return redirect(login)


@login_required
def media(request, media_file_id):
    """
    Serve a media file.
    """

    media_file = get_object_or_404(MediaFile, id=media_file_id)

    return sendfile(
        request, os.path.join(settings.MEDIA_ROOT, media_file.path),
        mimetype=media_file.mime_type)


@login_required
def thumbnail(request, media_file_id, thumbnail_id):
    """
    Serve a thumbnail file.
    """

    thumbnail = get_object_or_404(
        Thumbnail, media_file_id=media_file_id, id=thumbnail_id)

    return sendfile(
        request, os.path.join(settings.MEDIA_ROOT, thumbnail.path),
        mimetype=thumbnail.mime_type)


@login_required
def filmstrip(request, media_file_id, filmstrip_id):
    """
    Serve a filmstrip file.
    """

    filmstrip = get_object_or_404(
        Filmstrip, media_file_id=media_file_id, id=filmstrip_id)

    return sendfile(
        request, os.path.join(settings.MEDIA_ROOT, filmstrip.path),
        mimetype=filmstrip.mime_type)


def share(request, token):
    """
    Serve a shared file.

    This view does not require login, but requires a token.
    """

    share = get_object_or_404(
        Share,
        Q(expires__isnull=True) | Q(expires__gt=datetime.datetime.now()),
        token=token)

    # Increment number of views.
    share.views += 1
    share.save()

    return sendfile(
        request, os.path.join(settings.MEDIA_ROOT, share.media_file.path),
        mimetype=share.media_file.mime_type)
