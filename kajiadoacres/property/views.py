from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import (View, TemplateView, ListView,
                                  DetailView, CreateView,
                                  UpdateView, DeleteView)


def property(request):
    print("!!!!!!!!!!!!!!!!!!!!")
    return HttpResponse("Working")


class PropertyView(TemplateView):
    template_name = 'property/property.html'
