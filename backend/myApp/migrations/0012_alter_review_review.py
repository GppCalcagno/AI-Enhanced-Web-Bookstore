# Generated by Django 4.2.7 on 2023-11-30 21:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0011_alter_review_review'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='review',
            field=models.CharField(max_length=5000),
        ),
    ]
