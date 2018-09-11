document.addEventListener('DOMContentLoaded', () => {    
    getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie != '') {
            let cookies = document.cookie.split(';');
            for (i = 0; i < cookies.length; i++) {
                let cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

	let delete_from_cart = (food_line, price) => {
		const request = new XMLHttpRequest();		
		request.open('POST', '/remove-from-cart');
		request.onload = () => {
			const data = JSON.parse(request.responseText);
			if(data.status == "error") {
				alert(data.error);
			} else {
				console.log("Removed: " + food_line);
				document.querySelector('tr[data-line="'+food_line+'"][data-price="'+price+'"]').remove();
				prev_total = document.querySelector('.total').innerHTML;
				document.querySelector('.total').innerHTML = (prev_total - price).toFixed(2);
				if(document.querySelectorAll('table tbody tr').length == 1) {
					document.querySelector('.full-table').remove();
					let h2 = document.createElement('h2');
					h2.innerHTML = "No items in cart";
					h2.classList.add("text-center");
					document.querySelector('.container').append(h2);
				}

			}
		};

		// Add CSRF token to the ajax request
		request.setRequestHeader("X-CSRFToken", getCookie('csrftoken'))		

		// Add start and end points to request data.
		const data = new FormData();
		data.append('food_line', food_line);
		data.append('price', price);
		
		// Send request.
		request.send(data);		
	}		

	document.querySelectorAll('.delete').forEach( (btn) => {
		btn.addEventListener('click', () => {
			setTimeout(() => {
				food_line = btn.getAttribute('data-line');
				price = btn.getAttribute('data-price');
				delete_from_cart(food_line, price);
			}, 100)
		})
	});
});