from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import (View, TemplateView, ListView,
                                  DetailView, CreateView,
                                  UpdateView, DeleteView)
from .models import *


class PropertyView(TemplateView):
    template_name = 'property/property.html'


class PropertyDetailsView(DetailView):
    model = Property
    template_name = 'property/property.html'

    def get_context_data(self, *args, **kwargs):
        ctx = super(PropertyDetailsView, self).get_context_data(*args, **kwargs)
        property = Property.objects.filter(slug=self.kwargs['slug']).first()
        ctx['property_images'] = property.all_images()
        ctx['main_image'] = property.main_image()
        return ctx
        
