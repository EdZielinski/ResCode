document.addEventListener('DOMContentLoaded', () => {
	// total price of order in cart
	let order_total = 0;

	let pizza_toppings = ['1 topping', '2 toppings', '3 toppings', '1 item', '2 items', '3 items']

	// remove HTML from a string
	let strip = (html) => {
   		let  div = document.createElement("div");
   		div.innerHTML = html;
   		return div.textContent || div.innerText || "";
	}  

	// let selects and checkboxes for toppings
	let clear_toppings_form = () => {		
		for(i=1; i <= 3; i++) {
			document.querySelectorAll('.topping'+i).forEach( (topping_container) => {
				topping_container.querySelector('select').value = '';
			});
		}
		document.querySelectorAll('input[name="toppings-subs[]"]').forEach((checkbox) => {
			checkbox.checked = false;
		})
	}

	// read csrf cookie
    let csrf_cookie = (name) => {
        let cookie_value = null;
        if (document.cookie && document.cookie != '') {
            let cookies = document.cookie.split(';');
            for (i = 0; i < cookies.length; i++) {
                let cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookie_value = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookie_value;
    }	

    // ajax to add to cart
	let add_to_cart = (food_line, price) => {
		const request = new XMLHttpRequest();
		request.open('POST', '/add-to-cart');
		request.onload = () => {
			const data = JSON.parse(request.responseText);
			if(data.status == "error") {
				alert(data.error);
			} else {
				console.log("Added: " + food_line);
			}
		};

		// Add CSRF token to the ajax request
		request.setRequestHeader("X-CSRFToken", csrf_cookie('csrftoken'))		

		// Add start and end points to request data.
		const data = new FormData();
		data.append('food_line', food_line);
		data.append('price', price);

		// Send request.
		request.send(data);		
	}

	// ajax to remove from cart
	let delete_from_cart = (food_line, price) => {
		const request = new XMLHttpRequest();		
		request.open('POST', '/remove-from-cart');
		request.onload = () => {
			const data = JSON.parse(request.responseText);
			if(data.status == "error") {
				alert(data.error);
			} else {
				console.log("Removed: " + food_line);
			}
		};

		// Add CSRF token to the ajax request
		request.setRequestHeader("X-CSRFToken", csrf_cookie('csrftoken'))		

		// Add start and end points to request data.
		const data = new FormData();
		data.append('food_line', food_line);
		data.append('price', price);
		
		// Send request.
		request.send(data);		
	}

	// add food order to the order list 
	let add_to_order = (food_line, food, option, size, price) => {
		order_total = parseFloat(parseFloat(order_total + price).toFixed(2));
		document.querySelector('.total').innerHTML = order_total;
		let li = document.createElement('li');
		li.innerHTML = food_line;
		li.setAttribute('data-food', food)
		li.setAttribute('data-option', option)
		li.setAttribute('data-size', size)
		document.querySelector('.order_details').append(li);
		document.querySelector('.add[data-food="'+food+'"][data-option="'+option+'"]').setAttribute('data-added', 'added');			
		add_to_cart(food_line, price);	
	}

	// checks order list and removes if food item exists
	let check_order_details = (food, option, food_line = '') => {

		item_in_order = ''
	
		if(food_line == ''){
			item_in_order = document.querySelector('.order_details li[data-food="'+food+'"][data-option="'+option+'"]')
		} else {
			document.querySelectorAll('.order_details li').forEach( (li) => {
				if(li.innerHTML.trim() == food_line) {
					item_in_order = li;
				}
			});	
		}
		if(item_in_order) {
			item_in_order.remove();							
			let price = Number.parseFloat(item_in_order.innerHTML.split('$')[1]);
			order_total = parseFloat(parseFloat(order_total - price).toFixed(2));						
			document.querySelector('.total').innerHTML = order_total;
			delete_from_cart(item_in_order.innerHTML, price);
		}
	}

	// handle menu buttons on top
	document.querySelectorAll(".menu-btn").forEach( (btn) => {
		btn.addEventListener('click', (event) => {
			setTimeout(() => {
				document.querySelectorAll(".menu-btn").forEach( (menu_btn) => {
					menu_btn.classList.remove('active');	
				})
				btn.classList.add('active');
				let prev = document.querySelector('.food-table.active');
				prev.classList.remove('active');
				prev.classList.add('d-none');

				let current = document.querySelector('input[name=foods]:checked').value;
				let current_menu = document.querySelector('div[data-food="'+ current + '"');
				current_menu.classList.add('active');
				current_menu.classList.remove('d-none');
			}, 100);
		});
	});	

	// handle order buttons
	document.querySelectorAll('.add').forEach( (btn) => {
		btn.addEventListener('click', () => {
			setTimeout(() => { 
				let option = btn.getAttribute('data-option');
				let food = btn.getAttribute('data-food');
				let tr = btn.parentElement.parentElement;
				if(btn.classList.contains('active')) {
					btn.innerHTML = 'Delete -'						
					tr.querySelectorAll('input[data-option="'+option+'"]').forEach( (price_btn) => {
						price_btn.removeAttribute('disabled');
						if(price_btn.value == "Small" || price_btn.value == "Standard") {
							price_btn.click();
						}
					})

					if(btn.getAttribute('data-food') == 'Subs'){
						document.querySelector('.toppings-subs').classList.add('d-none');
						let action = document.querySelector('.subs-action');
						action.querySelector('.subs-done').setAttribute('data-option', option);
						action.querySelector('.subs-cancel').setAttribute('data-option', option);
						action.classList.add('d-none');	
					}						
				} else {
					check_order_details(food, option);
					btn.innerHTML = 'Order +';
					tr.querySelectorAll('input[data-option="'+option+'"]').forEach( (price_btn) => {
							price_btn.setAttribute('disabled',true);
							price_btn.closest('label').click();
					})
				}
			}, 120)
		})
	})

	// handle change in size for pizzas with toppings
	document.querySelectorAll('.price-label-btn[data-option$=topping], .price-label-btn[data-option$=toppings], .price-label-btn[data-option$=item], .price-label-btn[data-option$=items]').forEach( (btn) => {			
		btn.addEventListener('click', () => {
			clear_toppings_form();
			setTimeout(()=> {
				if(btn.classList.contains('active')){
					let food = btn.getAttribute('data-food');
					let option = btn.getAttribute('data-option');
					let size = btn.getAttribute('data-size');
					let add_btn = document.querySelector('.add.active[data-food="'+food+'"][data-option="'+option+'"]');
					let num_toppings = Number.parseInt(btn.getAttribute('data-option'));
					if(add_btn.getAttribute('data-added') == 'added'){
						for(i=1; i <= num_toppings; i++) {
							document.querySelector('.topping'+i+'[data-food="'+food+'"]').classList.remove('d-none');
						}
						document.querySelector('.menu').classList.add('disabled');
						document.querySelector('.toppings-subs').classList.add('d-none');
						document.querySelector('.subs-action').classList.add('d-none');
						document.querySelector('.action[data-food="'+food+'"]').classList.remove('d-none');
						let action = document.querySelector('.action[data-food="'+food+'"]');
						action.querySelector('.cancel').setAttribute('data-option', option);
						action.querySelector('.done').setAttribute('data-option', option);	
						action.querySelector('.cancel').setAttribute('data-size', size);
						action.querySelector('.done').setAttribute('data-size', size);	
						
					}
				}
			}, 120)
		});

	});					

	// handle adding of pizzas with toppings
	document.querySelectorAll('.add[data-option$=topping], .add[data-option$=toppings], .add[data-option$=item], .add[data-option$=items]').forEach( (btn) => {
		
		btn.addEventListener('click', () => {
			clear_toppings_form();
			document.querySelectorAll('.add.active[data-option$=topping], .add.active[data-option$=toppings], .add.active[data-option$=item], .add.active[data-option$=items]').forEach( (all_btn) => {
					if (all_btn != btn && all_btn.getAttribute('data-added') != "added"){
						all_btn.click();
					}
			})				
			setTimeout( () => {
				let num_toppings = Number.parseInt(btn.getAttribute('data-option'));
				let food = btn.getAttribute('data-food');
				let option = btn.getAttribute('data-option');
				let size = document.querySelector('.price-label-btn.active[data-food="'+food+'"][data-option="'+option+'"]').getAttribute('data-size');
				if(btn.classList.contains('active')) {						
					for(i=1; i <= num_toppings; i++) {
						document.querySelector('.topping'+i+'[data-food="'+food+'"]').classList.remove('d-none');
					}
					document.querySelector('.menu').classList.add('disabled');
					document.querySelector('.toppings-subs').classList.add('d-none');
					document.querySelector('.subs-action').classList.add('d-none');
					document.querySelector('.action[data-food="'+food+'"]').classList.remove('d-none');
					let action = document.querySelector('.action[data-food="'+food+'"]');
					action.querySelector('.cancel').setAttribute('data-option', option);
					action.querySelector('.done').setAttribute('data-option', option);	
					action.querySelector('.cancel').setAttribute('data-size', size);
					action.querySelector('.done').setAttribute('data-size', size);							

				} else {	
					document.querySelector('.menu').classList.remove('disabled');										
					for(i=1; i <= num_toppings; i++) {
						document.querySelector('.topping'+i+'[data-food="'+food+'"]').classList.add('d-none');
					}
					document.querySelector('.action[data-food="'+food+'"]').classList.add('d-none');
					clear_toppings_form();						
				}
			}, 120)
		})
	});

	// handle size selection for all other items except pizzas with toppings
	document.querySelectorAll('.price-label-btn').forEach( (btn) => {
		btn.addEventListener('click', () => {				
			setTimeout( () => {
				if(btn.classList.contains('price-label-btn') && btn.querySelector('input').disabled) {
					return;
				}				
				let option = btn.getAttribute('data-option');
				let food = btn.getAttribute('data-food');
				let size = '';
				if (pizza_toppings.indexOf(option) == -1) {
					let price = 0;
					if(btn.classList.contains('price-label-btn')) {
						price = Number.parseFloat(strip(btn.innerHTML.trim()));
						size = btn.getAttribute('data-size');
					} 

					let food_line = '';
					if(size != "Standard") {
						food_line = size + ' ' + food + ', ' + option + ' - $' + price;
					} else {
						food_line = food + ', ' + option + ' - $' + price;
					}
					

					if(btn.getAttribute('data-food') != 'Subs' && btn.classList.contains('price-label-btn') || btn.classList.contains('done') || btn.classList.contains('subs-done')){
						check_order_details(food, option);			
						add_to_order(food_line, food, option, size, price)			
					} else if(btn.getAttribute('data-food') == 'Subs' && btn.classList.contains('price-label-btn')) {
						document.querySelector('.menu').classList.add('disabled');
						for(i=1; i <= 3; i++) {
							document.querySelectorAll('.topping'+i).forEach( (topping_container) => {
								topping_container.classList.add('d-none');	
							})		
						}
						document.querySelectorAll('.action').forEach( (act) => {
							act.classList.add('d-none');	
						})
						let this_add_btn = document.querySelector('.add[data-food="'+food+'"][data-option="'+option+'"]');
						document.querySelectorAll('.add.active[data-food="'+food+'"]').forEach( (add_btn) => {

							if(add_btn.getAttribute('data-added') != "added" && this_add_btn != add_btn) {
								add_btn.click();
							}
						});					
					}

					clear_toppings_form();
				}

				if(btn.getAttribute('data-food') == 'Subs') {
					if(btn.classList.contains('active')){
						document.querySelector('.toppings-subs').classList.remove('d-none');
						document.querySelector('.subs-action').classList.remove('d-none');
					}
				}
			}, 120)
		})
	})	

	// handle clicking of done button for pizzas with toppings
	document.querySelectorAll('.done').forEach( (btn) => {
		btn.addEventListener('click', () => {				
			setTimeout( () => {				
				let option = btn.getAttribute('data-option');
				let food = btn.getAttribute('data-food');
				let label_btn = document.querySelector('.price-label-btn.active[data-food="'+food+'"][data-option="'+option+'"]');
				let price = Number.parseFloat(strip(label_btn.innerHTML.trim()));
				let size = label_btn.getAttribute('data-size');
				

				let food_line = '';

				document.querySelector('.menu').classList.remove('disabled');
				let num_toppings = Number.parseInt(option);
				let toppings = []
				for(i=1; i <= num_toppings; i++) {
					topping = document.querySelector('.topping'+i+'[data-food="'+food+'"]').querySelector('select').value;
					if(topping) {
						toppings.push(topping);
					}
				}
				toppings = toppings.join().replace(/,/g, ", ");
				if(size != "Standard") {
					food_line = size + ' ' + food + ', ' + option + ' + ' + toppings + ' - $' + price;
				} else {
					food_line = food + ', ' + option + ' + ' + toppings + ' - $' + price;
				}					

				check_order_details(food, option);
				add_to_order(food_line, food, option, size, price)	

				for(i=1; i <= num_toppings; i++) {
					document.querySelector('.topping'+i+'[data-food="'+food+'"]').classList.add('d-none');
				}							
				document.querySelector('.action[data-food="'+food+'"]').classList.add('d-none');

				clear_toppings_form();
				
			}, 120)
		})
	})		

	// handle clicking of done for subs
	document.querySelectorAll('.subs-done').forEach( (btn) => {
		btn.addEventListener('click', () => {				
			setTimeout( () => {				
				let option = btn.getAttribute('data-option');
				let food = btn.getAttribute('data-food');
				let label_btn = document.querySelector('.price-label-btn.active[data-food="'+food+'"][data-option="'+option+'"]');
				let price = Number.parseFloat(strip(label_btn.innerHTML.trim()));
				let size = label_btn.getAttribute('data-size');

				document.querySelector('.menu').classList.remove('disabled');
				let toppings = []
				document.querySelectorAll('input[name="toppings-subs[]"]:checked').forEach( (checkbox) => {
						toppings.push(checkbox.value)
					price += 0.5;
				})

				let food_line = '';
				toppings = toppings.join().replace(/,/g, ", ");
				if(size != "Standard") {
					food_line = size + ' ' + food + ', ' + option + ' + ' + toppings + ' - $' + price;
				} else {
					food_line = food + ', ' + option + ' + ' + toppings + ' - $' + price;
				}

				check_order_details(food, option);
				add_to_order(food_line, food, option, size, price)			

				document.querySelector('.toppings-subs').classList.add('d-none');
				document.querySelector('.subs-action').classList.add('d-none');
			
				clear_toppings_form();
				
				if(btn.getAttribute('data-food') == 'Subs') {
					if(btn.classList.contains('active')){
						document.querySelector('.toppings-subs').classList.remove('d-none');
						document.querySelector('.subs-action').classList.remove('d-none');
					}
				}
			}, 120)
		})
	})					

	// handle clicking of cancel button
	document.querySelectorAll('.cancel, .subs-cancel').forEach( (btn) => {
		btn.addEventListener('click', () => {
			setTimeout(() => {
				let option = btn.getAttribute('data-option');
				let food = btn.getAttribute('data-food');					
				if(option) {
					document.querySelector('.menu').classList.remove('disabled');
					document.querySelector('.add[data-food="'+food+'"][data-option="'+option+'"]').click();
					clear_toppings_form();
					if(btn.classList.contains('cancel')){
						let num_toppings = Number.parseInt(option);
						for(i = 1; i <= num_toppings; i++) {
							document.querySelector('.topping'+i+'[data-food="'+food+'"]').classList.add('d-none');
						}
						document.querySelector('.action[data-food="'+food+'"]').classList.add('d-none');	
					} else if(btn.classList.contains('subs-cancel')) {
						document.querySelector('.toppings-subs').classList.add('d-none');
						action.classList.add('d-none');	
					}						
				}										
			}, 120);
		});
	});
});