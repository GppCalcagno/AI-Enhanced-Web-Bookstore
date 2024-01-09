from django.http import HttpResponse #HttpResponse is used to send a data response to the client
from rest_framework.parsers import JSONParser #JSONParser is used to parse the JSON data
from django.http.response import JsonResponse

import jwt, datetime #jwt is used to generate a token for the user
from .serializers import BookSerializer, BookDetailSerializer, UserSerializer, CartSerializer,ReviewSerializer #import the serializers
import os

from .DB_interface import *
from .chatAPI import getBookInfo


def token_to_user(token):
    try: 
        payload = jwt.decode(token, os.getenv('SECRET_TOKEN_KEY'), algorithms=['HS256'])
        user = getUser(payload['userID'])
    except: return None # No logged user 

    return user

def user_to_token(user):
    payload = {
        'userID': user.userID,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        'iat': datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, os.getenv('SECRET_TOKEN_KEY'), algorithm='HS256')
    return token

############################################################################################ Book API
def book_API(request):

    if request.method == 'GET':
        books = getBookList(orderBy=request.GET.get('orderBy', None), titleFilter=request.GET.get('titleFilter', None), authorFilter=request.GET.get('authorFilter', None), priceFilter=request.GET.get('priceFilter', None), priceValue=request.GET.get('priceValue', None))
        books_serializer = BookSerializer(books, many=True) 
        return JsonResponse(books_serializer.data, safe=False)
    
    elif request.method == 'POST':
        book_data = JSONParser().parse(request)
        if storeBook(book_data):
            return JsonResponse("Book: Added Successfully!", safe=False)
        return JsonResponse("Book: Failed to Add.", safe=False)

    elif request.method == 'PUT':
        book_data = JSONParser().parse(request)
        if updateBook(book_data['bookID'],book_data):
            return JsonResponse("Book: Updated Successfully!", safe=False)
        return JsonResponse("Book: Failed to Update.", safe=False)

    elif request.method == 'DELETE':
        book_data = JSONParser().parse(request) 
        deleteBook(book_data['bookID'])
        return JsonResponse("Book: Deleted Successfully!", safe=False)
        

############################################################################################ Book Detail API

def bookDetail_API(request, id=0):

    if request.method == 'GET':
        # request.GET  http://localhost:8000/myApp/books/?id=123&pino=%2215%22
        book_detail = getBookDetail(id)
        if(book_detail == None): return JsonResponse({}, safe=False)
        book_detail_serializer = BookDetailSerializer(book_detail, many=False)
        return JsonResponse(book_detail_serializer.data, safe=False)

    
    elif request.method == 'POST':
        description_data = JSONParser().parse(request)
        if storeDescription(description_data):
            return JsonResponse("BookDescription: Added Successfully!", safe=False)
        return JsonResponse("BookDescription: FAIL ADDING", safe=False)

    elif request.method == 'PUT':
        description_data = JSONParser().parse(request)
        if updateBookDescription(description_data['bookDetailID'],description_data):
            return JsonResponse("BookDescription: Updated Successfully!", safe=False)
        return JsonResponse("BookDescription: FAIL UPDATING", safe=False)
    
################################################################################### User API
def login(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user = checkLogin(data['email'], data['password'])
        
        if user != None:
            token = user_to_token(user)
            response = JsonResponse("Login: Done!", safe=False)
            response.set_cookie(key='jwt', value=token, httponly=True)
            return response

        return JsonResponse("Login: Failed!", safe=False)


def signup(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user = storeUser(data['email'], data['password'])        
        
        print("Hello1")
        if user != None:
            token = user_to_token(user)
            response = JsonResponse("Registration: Done!", safe=False)
            response.set_cookie(key='jwt', value=token, httponly=True)
            return response
        print("Hello3")
        return JsonResponse("User: Failed to Add.", safe=False)
    

def getLoggedUser(request):
    if request.method == 'GET':

        user = token_to_user(request.COOKIES.get('jwt'))

        if user == None: 
            return JsonResponse(None, safe=False)
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data, safe=False)


def logout(request):
    response = JsonResponse("Logout: Done!", safe=False)
    response.delete_cookie('jwt')
    return response   

################################################################################### Cart API
def cart_API(request):

    # get logged user if exists
    user = token_to_user(request.COOKIES.get('jwt'))
    if(user == None): return JsonResponse(None, safe=False) # No logged user 

    if request.method == 'GET':
        cart = getUserCart(user)
        cart_serializer = CartSerializer(cart, many=True)

        books = []
        for item in cart_serializer.data:
            book = getBook(item['book'])
            book_serializer = BookSerializer(book)
            books.append(book_serializer.data)
            
        return JsonResponse(books, safe=False)
    
    elif request.method == 'POST':
        cart_data = JSONParser().parse(request)

        if addBookToCart(user, cart_data["book"]):
            return JsonResponse("Cart: Added Successfully!", safe=False)
        return JsonResponse("Cart: Failed to Add.", safe=False)
    

    elif request.method == 'DELETE':
        cart_data = JSONParser().parse(request)
    
        if deleteBookFromCart(user, cart_data['book']): 
            return JsonResponse("Cart: Deleted Successfully!", safe=False)
        return JsonResponse("Cart: Failed to delete", safe=False)
        
        
###################################################################################
def review_API(request,id):

    user = token_to_user(request.COOKIES.get('jwt'))
    if(user == None): return JsonResponse(None, safe=False) # No logged user 

    if request.method == 'GET':
        reviews = getBookReviews(id)
        reviews_serializer = ReviewSerializer(reviews, many=True)
        return JsonResponse(reviews_serializer.data, safe=False)
    
    elif request.method == 'POST':
        # retrive book data from request, user from token 
        review_data = JSONParser().parse(request)
        
        if storeReview(user,id,review_data):
           
            return JsonResponse("Review: Added Successfully!", safe=False)
        return JsonResponse("Review: Failed to Add.", safe=False)


##################################################################
def resume_AI_API(request,id):
    
    if request.method == 'GET':
        book = getBook(id)
        reviews = getBookReviews(id)

        comments = [obj.review for obj in reviews]
        info = getBookInfo(book.title,book.author,comments)

        return JsonResponse(info,safe=False)



