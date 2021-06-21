from django.db import models

from modelcluster.fields import ParentalKey

from wagtail.core.models import Page, Orderable
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.search import index

from property.models import Category, Property


class HomePage(Page):
    header_one = models.CharField(max_length=250, default='Find Land for Sale')
    header_two = models.CharField(
        max_length=250, default='Your trusted county experts in pre-verified properties.')

    content_panels = Page.content_panels + [
        FieldPanel('header_one'),
        FieldPanel('header_two'),
        InlinePanel('slider_images', label="Slider images"),
    ]

    def get_context(self, request):
        context = super(HomePage, self).get_context(request)
        context['property_categories'] = Category.objects.all()
        context['properties'] = Property.objects.all()
        return context


class HomePageGalleryImage(Orderable):
    page = ParentalKey(HomePage, on_delete=models.CASCADE,
                       related_name='slider_images')
    image = models.ForeignKey(
        'wagtailimages.Image', on_delete=models.CASCADE, related_name='+'
    )
    caption = models.CharField(blank=True, max_length=250)

    panels = [
        ImageChooserPanel('image'),
        FieldPanel('caption'),
    ]
