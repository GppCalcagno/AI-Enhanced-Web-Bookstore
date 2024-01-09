from django.urls import path
from . import views


# URL configuration, this is needed to map the URL to the view: link a URL to a specific function (request handler) in the views.py file
# i do not have to put MyApp in the URL because it is already linked in the main URLconf
urlpatterns = [
    
    path('books/', views.book_API),
    path('bookdetail/<int:id>/', views.bookDetail_API),

    path('login/', views.login),
    path('signup/', views.signup),
    path('getloggeduser/', views.getLoggedUser),
    path('logout/', views.logout),
    

    path('cart/', views.cart_API),
    path('review/<int:id>/', views.review_API),

    path('bookresume/<int:id>/', views.resume_AI_API)
]
