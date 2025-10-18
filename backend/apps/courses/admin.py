from django.contrib import admin

from .models import Course, CourseAssignment, CourseOffering

admin.site.register(Course)
admin.site.register(CourseAssignment)
admin.site.register(CourseOffering)
