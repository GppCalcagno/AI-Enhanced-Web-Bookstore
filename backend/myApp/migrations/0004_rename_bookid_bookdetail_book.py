# Generated by Django 4.2.7 on 2023-11-27 13:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0003_rename_book_bookdetail_bookid'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bookdetail',
            old_name='bookID',
            new_name='book',
        ),
    ]