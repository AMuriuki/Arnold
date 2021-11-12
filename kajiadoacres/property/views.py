from django.http.response import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
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
    properties = Property.objects.order_by('-date').values(
        'slug', 'title', 'price', 'date', 'property_type', 'category__id')
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
        paginator = Paginator(properties, 1)

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
            'slug', 'title', 'price', 'date', 'property_type').all()

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
        ctx['main_image'] = property.main_image()
        print(ctx['main_image'])
        return ctx
