from django.urls import path

from . import views

urlpatterns = [
    path('', views.PropertyView.as_view(), name='property'),
    path('details/<int:pk>', views.PropertyDetailsView.as_view(),
         name='property-details')
]
