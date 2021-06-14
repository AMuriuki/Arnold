# Generated by Django 3.2.4 on 2021-06-14 18:40

from django.db import migrations
import wagtail.core.fields


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0007_auto_20210614_1803'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='property',
            options={'verbose_name_plural': 'Properties'},
        ),
        migrations.AddField(
            model_name='property',
            name='property_features',
            field=wagtail.core.fields.RichTextField(blank=True),
        ),
    ]
