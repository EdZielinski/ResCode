# The Django admin site reads metadata from your data model
from django.contrib import admin
# The model contains essential fields and behavior of the data being stored
from .models import *


# The classes representing data are registered to take advantage of Django's ORM
admin.site.register(Food)
admin.site.register(Option)
admin.site.register(Size)
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(Food_line)