# Generated by Django 3.2.4 on 2021-06-13 18:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0004_property_propertytype'),
    ]

    operations = [
        migrations.RenameField(
            model_name='property',
            old_name='propertytype',
            new_name='property_type',
        ),
        migrations.AddField(
            model_name='property',
            name='price',
            field=models.CharField(default='KES', max_length=255),
        ),
    ]