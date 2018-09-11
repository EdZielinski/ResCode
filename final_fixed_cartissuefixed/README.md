# Pinocchio's Pizza & Subs  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This project is a pizza, subs and miscellaneous food ordering website, using Django 2.0.7, Python (3.7), Bootstrap (version 4), Django's templating system and Cascading Style Sheets (CSS3).

**Ordering Instructions**

* User navigates to the Order Menu
* User clicks on the Order+ button under the Action header
* User then chooses Small or Large
* Choose toppings
* Click on Cart
* Checkout

**Django admin**

* username - joe
* password - joe_pizza

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The creation of the superuser account occurs with the following command    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>$python manage.py createsuperuser  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After the creation of the data models. See models.py below, the following command is run  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>$python manage.py makemigrations  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next, /admin page is rendered from the browser and the tables are filled with data
# Functionality, Key components and Design

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Django’s web framework is the driving design behind this web site.  Django is a heavy weight web framework that offers many out-of-the box features.  A description of the process of setting up the web site’s framework, functionality, key components and design follows.

**Setting up the website project's framework**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To start a new project, the following command to give a folder structure framework of python files   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>$django-admin startproject pinocchios  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next run the following command to create a folder that will create the main app of the project  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>$python manage.py startapp orders  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The above commands give us the pinocchios folder and the orders folder

**pinocchios python files**

* Setting.py  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-There is a setting DEBUG=True that should be turned to false when delivered to production  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-Add the app orders to the installed apps with the setting 'orders.apps.OrdersConfig'  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In the orders.py there is a file named apps.py that allows for the inheritance of this class from the orders app  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-The allowed hosts setting is set to ALLOWED_HOSTS = ['*']. Later this is set to the Domain name  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-This is also where you would set up the language, time zone, WSGI and static file folder name

**orders python files**

* urls.py

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- The urls.py The path function associates the route with the function and route.  It also gives an alias name to the location of the website page.  This is beneficial should you need to move the page around.  This alias name can be used in the HTML layout files, or HTML pages and be used throughout the program.

* models.py

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- The models.py This file is where data definitions are defined and registered.  We define classes here and inherit the template Models.Mode to take advantage of Django's ORM so no SQL is written.  This allows for abstraction of SQLite, MySQL, Postgres, NoSQL, or any other version of SQL on the market.  Djangos ORM handles this for any language.  Pinocchio's model basically consists of three tables to order; Cart, Order and Food_Line. And three tables for stored data of Food, Options, and sizes.

* admin.py

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- The admin.py file registers our classes defined in the models.py file.  The registration is necessary for us to administer these classes from the Administrative screen.  Each class must be registered in order for the superuser to manipulate the classes.  Django's Object Relational Model (ORM) does all the work necessary to present it to an Administrative Interface for the superuser.  

* views.py

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- The views.py file is where we house the functions that the user sees through our HTML pages associated with each function.  The functions in the pinocchio project are summarized below:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- First is index, which displays the index page, which basically delivers some text and videos.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Next is menu which uses the food, option, and sizes tables to build the menu and create a dictionary to store the menu. So we loop over food, sizes and options to create the dictionary.  Once we have a dictionary with the menu, then we give it to the template menu.html.  So when you loop over the keys of the menu dictionary you get the menu. Next you create the menu with the food item.  These items were entered into the database first.  Then you add the options and then the sizes.  You create a table for each type.         
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Next is login_user which takes username and password from your form and we use the authenticate function so you can mark your users as active or inactive in Django, so if someone leaves the website you mark them as inactive. We check to see if the user is active and authenticated so then you login, otherwise you send them back to the login. IF they are not active.  If they just open the login page the request type would be get. It will not be post. Post is when they submit the form. So when they are just opening the login page this part will run and open the login. If the form is submitted, then the 'if part' will run and the user will be logged in. Same is true for the register page. If they just open the login page the request type would be get. It will not be post. Post is when they submit the form. So when they are just opening the login page this part will run and open the login. If the form is submitted, then the ‘if part’ will run and the user will be logged in, and the Cart is created. Same is true for the Register page.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- For the Register_user function, If they are submitting the form then the user will be registered.  User and password will be taken and try to create a new user, if a user already exists then it will be invalid, then it will give an error.  Then if it passes, the Cart is created for the User.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Next is the logout_user. The system will be notified that this user is logged out and the login page will open.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Profile_user contains the user details, when a user is logged uses the request  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Next is order, this is the page where you order things. The menu is created and stored as a dictionary. The menu is created using the three tables, then you get the cart and you clear the cart, but if something already exists then you are adding it to the order and the user may then add more items. The sub options are stored differently and displayed differently than the Regular Pizza and the Sicilian Pizza. The temp_vars are sent to the order_food.html page. The order page relies heavily on the order.js file in the static folder.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- In cart, we just get the Cart if there are items in it, then we return it.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- In orders, If there are no orders the return no items found, otherwise get the orders.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- In show_order, first check to see if user is a superuser and display order if true, otherwise display the users order. If the order is not found then redirect them to orders.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- In checkout we get the Cart and for each item in the Cart mark it as ordered.  Once a food item is ordered, then order status is true and we order the food_line item.  Once ordered set the Cart to zero.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- add_to_cart  and delete_from_cart are similar. Check if cart exists and either add or delete.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- In order_complete the user must be a superuser to mark as complete.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- For all_orders the user must be a superuser to view all orders in descending order  


**Requirements met**  

**Menu**
* Model create with built-in Users and Authentication system  
* SQLite used

**Adding Items**
* Created superuser to allow Admin to add, update, and remove items on the menu  
* All items from the menu are in the website

**Registration, Login, Logout**
* Customers can Register, Login and Logout  
* Ordering only complete by a registered user  

**Shopping Cart**
* Users can add items to a Shopping Cart, including toppings, or extras  
* Contents of shopping cart are saved, even if a user closes the window, logs out and then back in again

**Placing an Order**
* Once there is an item in the shopping cart, the user can place an order, confirm the order, before placing the order

**Special Pizza**
* Special Pizza means 5 different toppings

**Personal Touch**
* Site administrators are allowed to mark orders as complete and allow users to see the status of pending or completed orders


**Sources**

* The Django authentication system documentation  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://docs.djangoproject.com/en/2.0/topics/auth/default/  
* Models  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://docs.djangoproject.com/en/2.0/topics/db/models/  
* datetime - Basic date and time types from Python  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://docs.python.org/3/library/datetime.html  
* Admin  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://docs.djangoproject.com/en/2.0/ref/contrib/admin/  
* Models  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://docs.djangoproject.com/en/2.0/topics/db/models/  
* Request and response objects  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://docs.djangoproject.com/en/2.0/ref/request-response/  
* Django shortcut functions  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://docs.djangoproject.com/en/2.0/topics/http/shortcuts/  


