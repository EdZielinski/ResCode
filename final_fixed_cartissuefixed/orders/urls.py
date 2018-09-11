from django.urls import path

from . import views

# The path function associates the route with the function
# The <int:id>'s below represent individual order details
# all-orders is for the Administrator only
# whenever the user adds to cart a function runs to call the page add-to-cart
# whenever the user removes from cart a function runs to call the page remove-from-cart
urlpatterns = [
    path("", views.index, name="index"),
    path("menu", views.menu, name="menu"),
    path("order", views.order, name="order"),
    path("login", views.login_user, name="login"),
    path("logout", views.logout_user, name="logout"), 
    path("register", views.register_user, name="register"),
    path("profile", views.profile_user, name="profile"),
    path("orders", views.orders, name="orders"),
    path("order/<int:id>/", views.show_order, name="orders"),
    path("cart", views.cart, name="cart"),
    path("checkout", views.checkout, name="checkout"),
    path("add-to-cart", views.add_to_cart, name="add-to-cart"),
    path("remove-from-cart", views.delete_from_cart, name="remove-from-cart"),
    path("all-orders", views.all_orders, name="all-orders"),
    path("order-complete/<int:id>/", views.order_complete, name="all_orders")       
]
