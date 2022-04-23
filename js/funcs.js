export function toggleActive(button, elements=[], hideBody=false, queryElements=true) {

	const $btn = queryElements ? document.querySelector(button) : button
	$btn.addEventListener('click', () => {
		elements.forEach(el => {
			const $el = queryElements ? document.querySelector(el) : elements
			$el.classList.toggle('active')
		})
	})

	if (hideBody) document.body.classList.toggle('active')
}

export function addClass(elements=[], classes='active', query=true) {
	elements.forEach(el => {
		const $el = query ? document.querySelector(el) : el
		$el.classList.add(classes)
	})
}

export function removeClass(elements=[], classes='active', query=true) {
	elements.forEach(el => {
		const $el = query ? document.querySelector(el) : el
		$el.classList.remove(classes)
	})
}

export function closeSidebarOnClickBtn() {
	const sidebar = document.querySelector('.menu');
	sidebar.addEventListener('click', e => {
		if (e.target.tagName === 'BUTTON' && !e.target.className.includes('genres-title')) {
			removeClass(['.menu', '.burger-btn', 'body', '.bg-dark'], 'active');
		}
	});
}
