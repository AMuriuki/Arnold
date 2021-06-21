from django.utils.crypto import get_random_string


def unique_slug_generator(instance, new_slug=None):

    if new_slug is not None:
        slug = new_slug
    else:
        slug = get_random_string(length=25)

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(slug=slug).exists()
    if qs_exists:
        new_slug = get_random_string(length=25)
        return unique_slug_generator(instance, new_slug=new_slug)
    return slug
