import json
from django.http.response import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.utils.regex_helper import contains
from django.views.generic import (View, TemplateView, ListView,
                                  DetailView, CreateView,
                                  UpdateView, DeleteView)
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import *


def is_valid_queryparam(param):
    return param != '' and param is not None


class PropertyView(TemplateView):
    template_name = 'property/property.html'


class PropertiesView(TemplateView):
    template_name = 'property/properties.html'

    def get_context_data(self, *args, **kwargs):
        ctx = super(PropertiesView, self).get_context_data(*args, **kwargs)
        ctx['properties'] = Property.objects.all().order_by('-date')
        ctx['properties_choices'] = Property.objects.values(
            'property_type').distinct()
        ctx['prices'] = Property.objects.values('property_type').distinct()
        ctx['categories'] = Category.objects.all().order_by('-name')
        return ctx


def get_properties(request):
    property_ids = Property.objects.order_by('-date').values('id').all()
    property = []
    properties = []
    for property_id in property_ids:
        _property = Property.objects.filter(id=property_id['id']).first()
        main_image_title = _property.get_main_image_title()
        # id, description, category_id, property_type, date, price, title, slug, image
        if (' ' in main_image_title) == True:
            main_image_title = main_image_title.replace(' ', '_')
        property = [_property.id, _property.property_description, _property.category.id, _property.property_type,
                    _property.date, _property.price, _property.title, _property.slug, main_image_title]
        properties.append(property)

    return JsonResponse({'queryset': list(properties)})


def properties(request):
    if request.method == "GET":
        properties = Property.objects.all().order_by('-date')
        properties_choices = Property.objects.values(
            'property_type').distinct()
        prices = Property.objects.values('property_type').distinct()
        categories = Category.objects.all().order_by('-name')

        category_id = request.GET.get('category')

        if is_valid_queryparam(category_id):
            properties = properties.filter(category__id=category_id)

        page = request.GET.get('page', 1)
        paginator = Paginator(properties, 30)

        try:
            properties = paginator.page(page)
        except PageNotAnInteger:
            properties = paginator.page(1)
        except EmptyPage:
            properties = paginator.page(paginator.num_pages)

    if request.method == "POST":
        if request.POST.get('property_category'):
            category_id = request.POST.get('property_category')
        else:
            category_id = None

        properties = Property.objects.filter(category__id=category_id).values(
            'slug', 'title', 'price', 'date', 'property_type', 'property_images__image__file').all()

        return JsonResponse({'properties': list(properties)})

    return render(request, 'property/properties.html', {'properties': properties, 'properties_choices': properties_choices, 'prices': prices, 'categories': categories, 'category_id': category_id})


class PropertyDetailsView(DetailView):
    model = Property
    template_name = 'property/property.html'

    def get_context_data(self, *args, **kwargs):
        ctx = super(PropertyDetailsView, self).get_context_data(
            *args, **kwargs)
        property = Property.objects.filter(slug=self.kwargs['slug']).first()
        ctx['property_images'] = property.all_images()
        main_image = property.get_main_image_title()
        if (' ' in main_image) == True:
            ctx['main_image'] = main_image.replace(' ', '_')
        return ctx
