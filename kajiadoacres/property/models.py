import datetime

from django.db import models
from modelcluster.models import ClusterableModel

from modelcluster.fields import ParentalKey
from wagtail.core.models import Page, Orderable
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.search import index

from kajiadoacres.utils import unique_slug_generator


class Category(models.Model):
    name = models.CharField(max_length=255)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    class Meta:
        verbose_name_plural = 'Categories'

    panels = [
        FieldPanel('name'),
        ImageChooserPanel('image')
    ]

    def __str__(self):
        return self.name


class Property(ClusterableModel):
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    property_features = RichTextField(blank=True)
    property_description = RichTextField(blank=True)
    date = models.DateTimeField("Added", default=datetime.datetime.now)
    # actual_datetime = models.DateTimeField("Date Time Added", default=datetime.datetime.now)
    PROPERTY_CHOICES = (
        ('FOR SALE', "For Sale"),
        ('FOR RENT', "For Rent"),
    )
    property_type = models.CharField(
        max_length=10, choices=PROPERTY_CHOICES, default="FOR_SALE")
    price = models.CharField(max_length=255, default="KES")
    slug = models.SlugField(unique=True, default="none")

    class Meta:
        verbose_name_plural = 'Properties'

    panels = [
        FieldPanel('title'),
        FieldPanel('category'),
        FieldPanel('property_features', classname="full"),
        FieldPanel('property_description', classname="full"),
        FieldPanel('date'),
        FieldPanel('property_type'),
        FieldPanel('price'),
        InlinePanel('property_images', label="Property images"),
    ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.slug = unique_slug_generator(self)
        super().save(*args, **kwargs)

    def main_image(self):
        gallery_item = self.property_images.last()
        if gallery_item:
            return gallery_item.image
        else:
            return None

    def all_images(self):
        gallery_items = self.property_images.all()
        property_images = []
        for item in gallery_items:
            property_images.append(item.image)
        return property_images


class PropertyGalleryImage(Orderable):
    page = ParentalKey(Property, on_delete=models.CASCADE,
                       related_name='property_images')
    image = models.ForeignKey(
        'wagtailimages.Image', on_delete=models.CASCADE, related_name='+'
    )
    caption = models.CharField(blank=True, max_length=250)

    panels = [
        ImageChooserPanel('image'),
        FieldPanel('caption'),
    ]
