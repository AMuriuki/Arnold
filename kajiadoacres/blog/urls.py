from django.urls import path

from . import views

urlpatterns = [
    path('news-and-insights/', views.BlogIndexView.as_view(), name='blog'),
    # path('properties/', views.properties, name='properties'),
    # path('details/<slug>', views.PropertyDetailsView.as_view(),
    #      name='property_details')
]
