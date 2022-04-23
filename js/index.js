import {GetFilms} from "./GetFilms.js";
import {toggleActive, closeSidebarOnClickBtn} from "./funcs.js"

const menu = document.querySelector('.menu')
const categoryTitle = document.querySelector('.category')
const Films = new GetFilms()


menu.addEventListener('click', e => {
	const target = e.target

	switch (target.id) {
		case 'popular':
			Films.getPopular()
			categoryTitle.textContent = target.innerHTML
			break
		case 'top-rated':
			Films.getTopRated()
			categoryTitle.textContent = target.innerHTML
			break
		case 'upcoming':
			Films.getUpcoming()
			categoryTitle.textContent = target.innerHTML
			break
	}

	if (target.dataset.genreId) {
		const gId = target.dataset.genreId
		Films.getGenres(gId)
		categoryTitle.innerHTML = target.innerHTML + ' :'
	}
})

toggleActive('.genres-title', ['.genres'])
toggleActive('.burger-btn', ['.menu', '.burger-btn', 'body', '.bg-dark'])
toggleActive('.bg-dark', ['.menu', '.burger-btn', 'body', '.bg-dark'])

closeSidebarOnClickBtn();


console.log('Поздравляю ты хацкер!');
console.log('Как ты считаешь: Крут ли такой сайт/проект в портфолио Front-end junior?');
console.log('Жду твое мнение о сайте у себя в инсте -> @nasir.web')
