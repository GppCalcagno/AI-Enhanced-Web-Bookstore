# Generated by Django 4.2.7 on 2023-11-27 13:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0002_bookdetail'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bookdetail',
            old_name='book',
            new_name='bookID',
        ),
    ]
