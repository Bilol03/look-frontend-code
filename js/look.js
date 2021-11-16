const customersList = document.querySelector('.customers-list')
const ordersList = document.querySelector('.orders-list')
const clientId = document.querySelector('#clientId')
const userHeader = document.querySelector('#userHeader')
const inputName = document.querySelector('#usernameInput')
const inputPhone = document.querySelector('telephoneInput')
const submit = document.querySelector('.submit')

const hostName = 'http://192.168.137.1:8000'




function createElements (...array) {
	return array.map( el => {
		return document.createElement(el)
	} )
}

async function renderUsers () {
	const response = await fetch(hostName + '/users')
	const users = await response.json()
	for(let user of users) {
		const [li, span, a] = createElements('li', 'span', 'a')
		
		li.className = 'customer-item'
		span.className = 'customer-name'
		a.className = 'customer-phone'

		span.textContent = user.first_name
		a.textContent = '+' + user.telephone

		a.setAttribute('href', 'tel:+' + user.telephone)

		li.append(span, a)
		customersList.append(li)

		li.onclick = () => {
			renderOrders(user.user_id)
			clientId.textContent = user.user_id
			userHeader.textContent = user.first_name
		}
	}
}


async function renderOrders (userId) {
	const response = await fetch(hostName + '/orders/' + userId)
	const orders = await response.json()

	ordersList.innerHTML = null

	for(let order of orders) {
		const [li, img, div, foodName, foodCount] = createElements('li', 'img', 'div', 'span', 'span')
		
		li.className = 'order-item'
		foodName.className = 'order-name'
		foodCount.className = 'order-count'

		img.src = hostName + order.food.food_img_link

		foodName.textContent = order.food.food_name
		foodCount.textContent = order.count

		div.append(foodName, foodCount)
		li.append(img, div)
		ordersList.append(li)
	}

}

async function postInfo ({ username, phone }) {
    let responce = await fetch(hostName + '/users', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            username,
            phone
        })
    })
    return await responce.json()
}

submit.addEventListener('submit', async (el) => {
	el.preventDefault()
	let info = await postInfo({username: inputName.value, phone: inputPhone.value})
	renderUsers()
	// console.log(inputName.value)
	// console.log(inputPhone.value)
		
})

renderUsers()