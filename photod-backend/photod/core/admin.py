from django.contrib import admin

from photod.core.models import MediaFile, Tag, Person


@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    list_display = ("path", "mime_type", "created")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("label", )


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ("name", )
