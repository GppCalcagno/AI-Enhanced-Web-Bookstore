from myApp.serializers import BookDetailSerializer, BookSerializer,UserSerializer,CartSerializer,ReviewSerializer
from django.contrib.auth.hashers import make_password,check_password #make_password is used to hash the password
from .models import Book, BookDetail, Review,User,Cart, User

def getUser(userID):
    user = User.objects.filter(userID=userID).first()
    return user


############################################################################################ Book API
def getBookList(orderBy=None,titleFilter=None,authorFilter=None,priceFilter=None,priceValue=None):
    books = Book.objects.all()

    if titleFilter != None:
        books = books.filter(title__icontains=titleFilter)
    
    if authorFilter != None:
        books = books.filter(author__icontains=authorFilter)

    #check if priceValue is a number
    try: priceValue = float(priceValue)
    except: priceValue = None

    if priceFilter in ['minor','major'] and priceValue != None and priceValue>0:
        print("priceFilter: ", priceFilter)
        print("priceValue: ", priceValue)

        if priceFilter == 'minor': books = books.filter(price__lt=priceValue)
        else: books = books.filter(price__gt=priceValue)
        
    if orderBy != None:
        books = books.order_by(orderBy)
    
    return books

def getBook(bookID):
    book = Book.objects.get(bookID=bookID)
    return book

def updateBook(bookID, book_data):
    book = getBook(bookID)
    book_serializer = BookSerializer(book, data=book_data)
    
    if book_serializer.is_valid():
        book_serializer.save()
        return True
    return False

def deleteBook(bookID):
    book = getBook(bookID)
    book.delete()

def storeBook(book_data):
    book_serializer = BookSerializer(data=book_data)
    if book_serializer.is_valid():
        book_serializer.save()
        return True
    return False

############################################################################################ detail
def getBookDetail(bookID):
    try:bookDetail = BookDetail.objects.get(book_id=bookID)
    except: bookDetail = None
    return bookDetail

def storeDescription(description_data):
    description_serializer = BookDetailSerializer(data=description_data)
    if description_serializer.is_valid():
        description_serializer.save()
        return True
    return False

def updateBookDescription(ID, desc_data):
    entry = BookDetail.objects.get(bookDetailID=ID)
    entry_serializer = BookDetailSerializer(entry, data=desc_data)
    print("Entry: ", entry)
    if entry_serializer.is_valid():
        entry_serializer.save()
        return True
    return False

############################################################################################ user


def checkLogin(email, password):
    user = User.objects.filter(email=email).first()
    if user == None: return None
    
    if(check_password(password, user.password)):
        return user
    
    return None

def storeUser(email, password):
    password = make_password(password)
    user_serializer = UserSerializer(data={'email':email, 'password':password})

    if user_serializer.is_valid():
        user = user_serializer.save()
        return user
    return None


############################################################################################ cart
def getUserCart(user):
    cart = Cart.objects.filter(user=user).all()
    return cart

def addBookToCart(user,bookid):
    
    serializer = CartSerializer(data={'user':user.userID,'book':bookid})
    if serializer.is_valid():
        serializer.save()
        return True
    return False


def deleteBookFromCart(user,bookid):
    try:
        cart = Cart.objects.filter(user=user,book_id=bookid).first()
        cart.delete()
        return True
    except Exception as e:
        print(e)
        return False

############################################################################################ review
def getBookReviews(bookID):
    reviews = Review.objects.filter(book=bookID).all()
    return reviews

def storeReview(user,bookID,review_data):
    review_data['user'] = user.userID
    review_data['book'] = bookID
        
    reviews = Review.objects.filter(book=bookID,user=user.userID).first()

    if(reviews!= None): 
        print("Review already exists")
        return False

    
    serializer = ReviewSerializer(data=review_data)    

    if serializer.is_valid():
        serializer.save()
        return True
    
    print(serializer.errors)
    return False
