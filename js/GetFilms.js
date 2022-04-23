import {addClass, removeClass, toggleActive} from "./funcs.js";

export class GetFilms {

	constructor() {
		this.url = {
			baseUrl: 'https://api.themoviedb.org/3',
			apiKey: 'api_key=25a5aad6a57c61856fa68aeeccda3309',
			lang: 'language=ru',
			without_keywords: '',
			imgUrl: filePath => `http://image.tmdb.org/t/p/w342/${filePath}`
		}

		this.paginationCallback = (e) => {
			if (e.target.nodeName === 'BUTTON') {
				let arrQuery = this.queryUrl.split('&')
				arrQuery = arrQuery.filter(el => !el.includes('page')).join('&')

				this.currentPage = e.target.innerHTML
				this.requestedDataToHTML(arrQuery, `&page=${this.currentPage}`, false)
			}
		}

		this.genreList()

		if (window.localStorage['lastQuery']) {
			console.log(window.localStorage['lastQuery']);
			this.requestedDataToHTML(window.localStorage['lastQuery'], '', false)
		} else {
			this.getPopular()
		}

		this.getFilmDetail()
	}

	getPopular() {
		this.requestedDataToHTML('movie/popular')
	}

	getNowPlaying() {
		this.requestedDataToHTML('movie/now_playing')
	}

	getTopRated() {
		this.requestedDataToHTML('movie/top_rated')
	}

	getUpcoming() {
		this.requestedDataToHTML('movie/upcoming')
	}

	getGenres(genreId) {
		this.requestedDataToHTML('discover/movie', `&with_genres=${genreId}`)
	}

	genreList() {
		const $genreList = document.querySelector('.genres')
		const genreListUrl = `${this.url.baseUrl}/genre/movie/list?${this.url.apiKey}&${this.url.lang}`

		this.query(genreListUrl, data => {
			const list = data.genres.map(genre => {
				const genreName = genre.name[0].toUpperCase() + genre.name.slice(1)
				if (genre.id !== 99) {
					return `
						<button type="button" data-genre-id="${genre.id}">${genreName}</button>
					`
				}
			}).join('')

			$genreList.innerHTML = list
		})

	}

	getFilmDetail() {
		const carList = document.querySelector('.card-list')
		const modal = document.querySelector('.modal')
		const modalImg = modal.querySelector('.modal-container img')
		const modalIframe = modal.querySelector('.modal-container iframe')
		const modalDate = modal.querySelector('.modal-container .date')
		const modalTitle = modal.querySelector('.modal-container .title')
		const modalDesc = modal.querySelector('.modal-container .desc')
		let filmId

		carList.addEventListener('click', e => {
			if (e.target.classList.contains('card-item')) {
				const target = e.target
				const img = target.querySelector('img').src
				const title = target.querySelector('h3').innerHTML
				const desc = target.querySelector('#data').dataset.desc
				const date = target.querySelector('#data').dataset.date

				filmId = target.dataset.filmId
				this.getFilmTrailer(filmId)

				modal.style.top = `${window.pageYOffset}px`
				modalDate.innerHTML = `Дата выхода: ${date}`
				modalTitle.innerHTML = title
				modalDesc.innerHTML = desc

				addClass([modal, document.body],'active', false)
			}
		})

		modal.addEventListener('click', e => {
			if (e.target.classList.contains('modal') || e.target.className === 'close')
			removeClass([modal, document.body],'active', false)
			modalIframe.src = ''
		})
	}

	async getFilmTrailer(filmId) {

		const key = await fetch(`${this.url.baseUrl}/movie/${filmId}/videos?${this.url.apiKey}&${this.url.lang}`, {})
			.then(res => res.json())
			.then(data => {
				if (data.results.length) {
					return data.results[0]['key']
				} else {
					return '3QtqXM5sdaY'
				}
			})
		// const json = await res.json()
		// const key = await json.results[0]['key']
		// console.log(key)

		const modalIframe = document.querySelector('.modal-container iframe')
		modalIframe.src = `https://www.youtube.com/embed/${key}`

	}

	getPagination(pages) {
		const $pagination = document.querySelector('.pagination')
		const cur = Number(this.currentPage) - 1
		const totalPages = []

		for (let i = 1; i <= pages; i++) {
			totalPages.push(`<button id="${i-1}">${i}</button>`)
		}

		function currentPages(arr) {
			const curPage = arr[cur]
			const prevPage = arr[cur-1]
			const nextPage = arr[cur+1]
			const firstPage = arr[0]
			const lastPage = arr[arr.length - 1]

			if (!prevPage && nextPage) {
				return `${firstPage} ${nextPage} ${arr[cur+2]} ... ${lastPage}`
			} else if (prevPage && nextPage) {
				if (arr[cur-2] && arr[cur+2]) {
					return `${firstPage} ... ${prevPage} ${curPage} ${nextPage} ... ${lastPage}`
				}
				return `${prevPage}${curPage}${nextPage} ... ${lastPage}`
			} else if (prevPage && !nextPage) {
				return `${firstPage} ... ${arr[cur-2]} ${prevPage} ${curPage}`
			} else {
				return 'empty'
			}

		}

		$pagination.innerHTML = currentPages(totalPages)
		$pagination.addEventListener('click', this.paginationCallback)

		window.scrollTo(0, 0)
		const curBtn = Array.from(document.querySelectorAll('.pagination button'))
		curBtn.find(el => {
			if (Number(el.id) === cur) el.classList.add('active')
		})
	}

	requestedDataToHTML(query, options='', croppedUrl=true) {
		let endQuery
		if (croppedUrl) {
			endQuery = `${this.url.baseUrl}/${query}?${this.url.apiKey}&${this.url.lang}&include_adult=false?${this.url.without_keywords}${options}`
			this.query(endQuery, this.dataToHTML.bind(this))
		} else {
			this.query(
				`${query}${options}`,
				this.dataToHTML.bind(this)
				)
			}
			
			// window.localStorage['lastQuery'] = endQuery
	}

	dataToHTML(data={}) {
		const cardList = document.querySelector('.card-list')
		const imgUrl = (path) => this.url.imgUrl(path)

		const films = data.results.map(f => {
			const img = f.poster_path !== null ? imgUrl(f.poster_path) : 'http://www.ballonssansfrontiere.com/wp-content/plugins/download-manager/assets/images/img-404.png'
			const date = f.release_date
			const desc = f.overview
			let shortDesc = desc.substr(0, 120)
			shortDesc = shortDesc.length < 120 ? shortDesc : shortDesc + '...'

			const dateCut = date ? date.split('-')[0] : 'Нэ знаю'

			return `
			<div class="card-item" data-film-id="${f.id}">
					<img src="${img}" loading="lazy" alt="">
					<div id="data" data-date="${date}" data-desc="${desc}"></div>
					<div class="card-header">
						<div class="rate">${f.vote_average}</div>
						<p class="date">${dateCut}</p>
					</div>
					<div class="card-body">
						<h3>${f.title}</h3>
						<p class="desc">${shortDesc}</p>
					</div>
			</div>
			`
		}).join('')

		cardList.innerHTML = films
	}

	query(url, callback) {
		fetch(url)
			.then(res => {
				this.queryUrl = res.url
				return res.json()
			})
			.then(data => {
				this.getPagination(data.total_pages)
				this.currentPage = 1
				return data
			})
			.then(callback)
			.catch(e => console.log(e))
	}

}
