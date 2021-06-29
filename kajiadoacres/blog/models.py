from django.db import models

from wagtail.core.models import Page
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.search import index


class BlogIndexPage(Page):
    intro = RichTextField(blank=True)
    page_title = models.CharField(max_length=250, default='page title')
    page_subtitle = models.CharField(max_length=250, default='page sub-title')

    content_panels = Page.content_panels + [
        FieldPanel('page_title'),
        FieldPanel('page_subtitle'),
        FieldPanel('intro', classname="full")
    ]

    def get_context(self, request):
        context = super().get_context(request)
        blogpages = self.get_children().live().order_by('-first_published_at')
        featured_post = blogpages[:1]
        context['blogpages'] = blogpages
        context['featured_post'] = featured_post
        print(context['featured_post'])
        return context


class BlogPage(Page):
    date = models.DateField("Post date")
    intro = RichTextField(blank=True)
    body = RichTextField(blank=True)

    search_fields = Page.search_fields + [
        index.SearchField('intro'),
        index.SearchField('body'),
    ]

    content_panels = Page.content_panels + [
        FieldPanel('date'),
        FieldPanel('intro'),
        FieldPanel('body', classname="full"),
    ]
