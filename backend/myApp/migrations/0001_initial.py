# Generated by Django 4.2.7 on 2023-11-26 11:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('bookID', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100)),
                ('author', models.CharField(max_length=100)),
                ('pub_year', models.IntegerField()),
                ('price', models.FloatField()),
            ],
        ),
    ]
