from django.contrib import admin

from .models import Content, DownloadLog

admin.site.register(Content)
admin.site.register(DownloadLog)
