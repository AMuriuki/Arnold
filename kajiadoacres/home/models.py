from django.db import models

from wagtail.core.models import Page
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel


class HomePage(Page):
    header_one = models.CharField(max_length=250, default='Find Land for Sale')
    header_two = models.CharField(max_length=250, default='Your trusted county experts in pre-verified properties.')

    content_panels = Page.content_panels + [
        FieldPanel('header_one'),
        FieldPanel('header_two'),
    ]