from django.urls import path

from . import views

urlpatterns = [
    path('', views.PropertyView.as_view(), name='property'),
    path('properties/', views.properties, name='properties'),
    path('details/<slug>', views.PropertyDetailsView.as_view(),
         name='property_details')
]
