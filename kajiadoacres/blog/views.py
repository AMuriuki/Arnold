from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import (View, TemplateView, ListView,
                                  DetailView, CreateView,
                                  UpdateView, DeleteView)
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import *


class BlogIndexView(TemplateView):
    template_name = 'blog/blog_index_page.html'
