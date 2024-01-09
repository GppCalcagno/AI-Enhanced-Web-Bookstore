from django.db import models


# Create your models here.
#ID, titolo, autore, anno di pubblicazione e prezzo

class Book(models.Model):
    bookID = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    pub_year = models.IntegerField()
    price = models.FloatField()


class BookDetail(models.Model):
    bookDetailID = models.AutoField(primary_key=True)
    isbn = models.CharField(max_length=20,null=True)
    notes = models.TextField(null=True)
    pages = models.IntegerField(null=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE) # CASCADE: if the book is deleted, delete the book detail as well


class User(models.Model):
    userID = models.AutoField(primary_key=True)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)


class Cart(models.Model):
    cartID = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

class Review(models.Model):
    reviewID = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    rating = models.IntegerField()
    review = models.CharField(max_length=5000)
    