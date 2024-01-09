from rest_framework import serializers
from .models import Book, BookDetail, User, Cart, Review

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('bookID', 'title', 'author', 'pub_year', 'price')

class BookDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookDetail
        fields = ('bookDetailID', 'isbn', 'notes', 'pages', 'book') # book is a foreign key, so it is a field of the BookDetail model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('userID', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ('cartID', 'user', 'book')

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('reviewID', 'user', 'book', 'rating', 'review')
