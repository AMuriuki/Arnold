from wagtail.contrib.modeladmin.options import (
    ModelAdmin, ModelAdminGroup, modeladmin_register
)
from .models import Category, Property


class CategoryAdmin(ModelAdmin):
    model = Category
    menu_label = 'Property Category'
    menu_icon = 'group'
    menu_order = 200
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ('name',)
    list_filter = ('name',)
    search_fields = ('name',)


class PropertyAdmin(ModelAdmin):
    model = Property
    menu_label = 'Property Listing'
    menu_icon = 'group'
    list_display = ('title',)
    list_filter = ('title',)
    search_fields = ('title',)


class PropertyGroup(ModelAdminGroup):
    menu_label = "Property"
    menu_icon = "folder-open-inverse"
    menu_order = 200
    items = (CategoryAdmin, PropertyAdmin)


modeladmin_register(PropertyGroup)
