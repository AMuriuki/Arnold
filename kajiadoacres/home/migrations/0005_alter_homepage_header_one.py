# Generated by Django 3.2.4 on 2021-06-12 14:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0004_rename_body_homepage_header_one'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homepage',
            name='header_one',
            field=models.CharField(max_length=250),
        ),
    ]