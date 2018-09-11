# Django uses request and response objects to pass state through the system
from django.http import HttpResponse, JsonResponse
# Django shortcut functions
from django.shortcuts import render, redirect, get_object_or_404
# Django authentication system
from django.contrib.auth import login, logout, authenticate
# Django authentication system for login required
from django.contrib.auth.decorators import login_required
# We use django's User object to manage User storage to use in our models
from django.contrib.auth.models import User

from .models import *

# Create your views here.
def index(request):
    return render(request, "order/index.html")

def menu(request):
    # dictionary to store the menu
    menu = {}

    # get all food items
    foods = Food.objects.all()

    # loop over food items and build the menu
    for food in foods:        
        menu[food.name] = {}
        menu[food.name]['types'] = []
        menu[food.name]['sizes'] = set()   

        # get all options for a food item
        options = Option.objects.filter(food=food)        
        for option in options:
            food_type = [option.name]
            sizes = Size.objects.filter(option=option)

            # get all sizes for a food item
            for size in sizes:
                food_type.append(size.price)
                menu[food.name]['sizes'].add(size.name)
            menu[food.name]['types'].append(food_type)  
        menu[food.name]['sizes'] = menu[food.name]['sizes']

    return render(request, "order/menu.html", {'menu': menu})                 

def login_user(request):

    if request.method == "POST":

        # Get POST params from request
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')

        user = authenticate(username=username, password=password)

        # Valid username and password
        if user is not None and user.is_active:
            login(request, user)
            return redirect('index')
        # Incorrect username or password
        elif user is None:
            return render(request, "order/login.html", {'message': 'Invalid username and/or password'})
        # User is inactive
        else:
            return render(request, 'order/login.html', {'message': 'User is not active in the system'})

    else:
        return render(request, 'order/login.html')

def register_user(request):

    if request.method == "POST":

        # Get POST params from request
        first_name = request.POST.get('first_name', '')
        last_name = request.POST.get('last_name', '')
        email = request.POST.get('email', '')
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')

        # Make sure a user with this username doesn't already exist
        try:
            User.objects.get(username=username)
            return render(request, "order/register.html", {
                'message': 'A user with that username already exists in the system. Please choose another username'
            })
        except User.DoesNotExist:
            pass

        # Validate input
        if not username or not password:
            return render(request, "order/register.html", {'message': 'Please enter a non-empty username and password.'})

        # Create new user
        user = User.objects.create_user(username, password=password, first_name=first_name, last_name=last_name, email=email)        

        # Login new user
        user = authenticate(username=username, password=password)

        # create cart for the user
        cart = Cart(user=user, cart_total="0")
        cart.save()        
        login(request, user)

        # Send the newly logged in user to the quote page
        return redirect('index')

    else:
        # Display registration form
        return render(request, 'order/register.html')


def logout_user(request):
    # logout the user and redirect to login page
    logout(request)
    return redirect('login')   

def profile_user(request):
    return render(request, 'order/profile.html')

def order(request):
    # dictionary to store the menu
    menu = {}
    foods = Food.objects.all()

    # list to store the toppings for subs
    subs_toppings = ['+Mushrooms', '+Green Peppers','+Onions','Extra Cheese on any sub']

    # loop over food items to build a menu
    for food in foods:    
        menu[food.name] = {}  

        # get all options for the food item
        options = Option.objects.filter(food=food)
        for option in options:
            if food.name != 'subs' and option.name not in subs_toppings:
                menu[food.name][option.name] = {}
                # get all sizes for the option
                sizes = Size.objects.filter(option=option)
                for size in sizes:
                    menu[food.name][option.name][size.name] = size.price  

    # remove + from topping names and change extra cheese string
    toppings_temp = [toppings.replace("+","") for toppings in subs_toppings]
    toppings_temp[-1] = 'Extra Cheese'

    # dictionary to be sent to the template
    temp_vars = {
        'menu': menu,
        'toppings_list': list(range(1,4)),
        'pizza_with_toppings': ["Regular Pizza", "Sicilian Pizza"],
        'subs_toppings' : toppings_temp,
    }

    return render(request, "order/order_food.html", temp_vars)                  


def cart(request): 
    # get the cart   
    cart = get_object_or_404(Cart, user=request.user)

    # get cart total
    total = cart.cart_total

    # get food items in cart
    food_lines = Food_line.objects.filter(cart=cart, order_status=False)

    # if no items in cart
    if len(food_lines) == 0:
        return render(request, 'order/cart.html', {'no_items_found':True})            

    return render(request, 'order/cart.html', {'food_lines':food_lines, 'total':total})

def orders(request):
    # get all orders for the current user
    orders = Order.objects.filter(user=request.user)

    # if no orders
    if len(orders) == 0:
        return render(request, 'order/orders.html', {'no_items_found':True})     

    # list to store orders
    order_details = []

    # loop over orders to get items in orders and build order list
    for order in orders:
        order.order_total = round(float(order.order_total), 2)
        full_order_details = []
        food_lines = Food_line.objects.filter(order=order, order_status=True)

        # get food items in orders
        for food_line in food_lines:
            full_order_details.append(food_line.food_line)
        order_details.append({'order': order, 'full_order_details': '\n'.join(full_order_details)})    

    return render(request, 'order/orders.html', {'orders':order_details})

def show_order(request, id):   
    order = None

    # get order
    if request.user.is_superuser:
        order = Order.objects.get(id=id)    
    else:
        order = Order.objects.get(id=id, user=request.user)

    # if no such order
    if not order:
        return redirect('orders')
    
    # get order total
    order_total = order.order_total

    # get food items in order
    food_lines = Food_line.objects.filter(order=order, order_status=True)

    return render(request, 'order/order_details.html', {'order': order, 'food_lines':food_lines, 'total':order_total})

def checkout(request):
    # get the cart object for the user
    cart = get_object_or_404(Cart, user=request.user)

    # get total of the cart
    total = cart.cart_total            

    # get food items in cart
    food_lines = Food_line.objects.filter(cart=cart, order_status=False)

    # if no food item is found in cart then redirect to order page
    if len(food_lines) == 0:
        return redirect('order')

    # create a new order
    order = Order(user=request.user, order_total=total) 
    order.save()

    # set order for food_lines and mark their order_status as true
    for food_line in food_lines:
        food_line.order_status = True
        food_line.order = order
        food_line.save()

    # reset cart total to 0
    cart.cart_total = 0
    cart.save()        

    return redirect('orders')

def add_to_cart(request):
    # get food item's details and price
    food_line = request.POST.get('food_line', '');
    price = request.POST.get('price', '');

    # if details and not valid
    if food_line == '' or price == '':
        return JsonResponse({"status": "error","error": "Invalid Parameters"})   

    # get cart object for the user
    cart = Cart.objects.get(user=request.user)

    # if cart does not exist (Note cart for a user is created on register)
    if not cart:
        return JsonResponse({"status": "error","error": "Cart not found"})

    # update cart total
    cart.cart_total = str(float(cart.cart_total) + float(price))
    cart.save()    

    # create a food line object to store the food item
    food_line_obj = Food_line(food_line = food_line, price=price, cart=cart)
    food_line_obj.save()

    return JsonResponse({"status": "success"})

def delete_from_cart(request):
    # get food item's details and price
    food_line = request.POST.get('food_line', '');
    price = request.POST.get('price', '');

    # if details and not valid
    if food_line == '' or price == '':
        message = {
            "status": "error",
            "error": "Invalid Parameters"
        }
        return JsonResponse({"status": "error","error": "Invalid Parameters"})

    # get cart object for the user
    cart = Cart.objects.get(user=request.user)

    # if cart does not exist (Note cart for a user is created on register)
    if not cart:
        return JsonResponse({"status": "error","error": "Cart not found"})

    # update cart total
    cart.cart_total = str(float(cart.cart_total) - float(price))
    cart.save()

    # get the food line object as per the details
    food_line_obj = Food_line.objects.filter(food_line = food_line, price=price, cart=cart, order_status=False)[0]

    # if food item is not found in cart
    if not food_line_obj:
        return JsonResponse({"status": "error","error": "Not found in cart"})

    # delete the food line object
    food_line_obj.delete()    

    return JsonResponse({"status": "success"})

def order_complete(request, id): 
    # if user is not admin redirect to orders
    if not request.user.is_superuser:
        return redirect('orders')

    # get the order as per the id and mark it completed
    order = Order.objects.get(id=id)
    order.completed = True
    order.save()
    return redirect('all-orders')
    
def all_orders(request):
    # if user is not admin redirect to orders
    if not request.user.is_superuser:
        return redirect('orders')
    
    # get all orders, order by time in descending order
    orders = Order.objects.all().order_by('-order_created_at')

    if len(orders) == 0:
        return render(request, 'order/allorders.html', {'no_items_found':True})     

    # list to store order details    
    order_details = []

    # loop over orders to fetch food items.
    for order in orders:
        # get order total
        order.order_total = round(float(order.order_total), 2)

        # list to store detials of food items in order
        full_order_details = []

        # get food items in order
        food_lines = Food_line.objects.filter(order=order, order_status=True)
        for food_line in food_lines:
            full_order_details.append(food_line.food_line)
        order_details.append({'order': order, 'full_order_details': '\n'.join(full_order_details)})           

    return render(request, 'order/allorders.html', {'orders':order_details})
