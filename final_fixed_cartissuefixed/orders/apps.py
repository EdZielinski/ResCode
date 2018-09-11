from django.apps import AppConfig

# allows for inheritance of the class from the orders app. See settings
class OrdersConfig(AppConfig):
    name = 'orders'
