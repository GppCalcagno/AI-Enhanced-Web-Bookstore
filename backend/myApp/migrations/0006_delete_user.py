# Generated by Django 4.2.7 on 2023-11-28 16:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0005_user'),
    ]

    operations = [
        migrations.DeleteModel(
            name='User',
        ),
    ]