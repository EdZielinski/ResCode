# datetime module from Python supplies classes for manipulating dates and time
from datetime import datetime
# A model is a source of information about the data, generally mapping to a database table
from django.db import models
# The User object is the core of the authentication system
# We use django's User object to manage User storage to use in our models
from django.contrib.auth.models import User


# There are three tables to organize the Cart and Order
# There are three tables for storing the food information
# Food will contain food categories like Regular Pizza, Sicilian Pizza, Subs Salads
class Food(models.Model):
    name = models.CharField(primary_key=True, max_length=120)

    def __str__(self):
        return self.name

# Options contains whatever options like 'one topping', 'two toppings', 'special'
# Option is attached to the Food by a Foreign Key		
class Option(models.Model):
    name = models.CharField(max_length=120)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)

    def __str__(self):
        return self.name + ' | ' + self.food.name

# Size is small, or large	
# Size is attached to the Option by a Foreign Key	
# Size also has the price attached to it
class Size(models.Model):
    name = models.CharField(max_length=120)
    price = models.CharField(max_length=20)
    option = models.ForeignKey(Option, on_delete=models.CASCADE)    

    def __str__(self):
        return self.name + ' | ' + self.option.name + ' | ' + self.option.food.name


# Every Cart is attached to a User with the Foreign Key		
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cart_total = models.CharField(default="0", max_length=20)
    cart_updated_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return 'Cart - ' + self.user.username


# Every Order is attached to a User with a Foreign Key		
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_total = models.CharField(default="0", max_length=20)
    order_created_at = models.DateTimeField(default=datetime.now, blank=True)
    completed = models.BooleanField(default=False)  

    def __str__(self):
        return 'Order by ' + self.user.username

		
# Every Food_Line is attached to a Cart and an Order with a Foreign Key
# Whenever a user orders, a Food_Line item is created with a description, price, status and date
class Food_line(models.Model):
    food_line = models.CharField(max_length=200)
    price = models.CharField(max_length=20)
    cart = models.ForeignKey(Cart, related_name="Cart", on_delete=models.DO_NOTHING)
    order = models.ForeignKey(Order, related_name="Order", on_delete=models.CASCADE, blank=True, null=True)     
    order_status = models.BooleanField(default=False)   
    created_at = models.DateTimeField(default=datetime.now, blank=True) 

    def __str__(self):
        return self.food_line