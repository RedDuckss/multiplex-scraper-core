const { EventEmitter } = require('events');
const got = require('got');
const async = require('async');
const { JSDOM } = require('jsdom');
const embedScraper = require('../embed');

const URL_BASE = 'https://moviesjoy.net';
const URL_SEARCH = `${URL_BASE}/search`;
const AJAX_BASE = `${URL_BASE}/ajax`;
const AJAX_EPISODES = `${AJAX_BASE}/v4_movie_episodes`;
const AJAX_EMBED = `${AJAX_BASE}/movie_embed`;

class MoviesJoy extends EventEmitter {
	constructor() {
		super();
	}

	async scrape({title}, type) {
		if (type !== 'movie') { // This site supports TV shows! Need to add TV show support
			return this.emit('finished');
		}

		let response = await got(`${URL_SEARCH}/${escape(title).replace(/%20/g, '+')}`);
		const searchResults = response.body;
		let dom = new JSDOM(searchResults);

		const movieObject = [...dom.window.document.querySelectorAll('.flw-item')]
			.map(element => {
				const dataUrl = element.querySelector('.flw-item-tip').dataset.url.split('/');
				return {
					name: element.querySelector('.film-name a').innerHTML,
					id: dataUrl[2],
					movie_id: dataUrl[3]
				};
			})
			.find(({name}) => name === title);
		
		if (!movieObject) {
			return this.emit('finished');
		}

		response = await got(`${AJAX_EPISODES}/${movieObject.id}/${movieObject.movie_id}`, {
			json: true
		});
		const {html} = response.body;
		dom = new JSDOM(html);

		const episodeDataList = [...dom.window.document.querySelectorAll('.nav-item')]
			.map(element => ({
				server: element.dataset.server,
				id: element.dataset.id,
				type: element.getAttribute('onclick').match(/'(\w*?)'/)[1]
			}));
		
		async.each(episodeDataList, ({server, id, type}, callback) => {

			if (type !== 'embed') {
				return callback();
			}
			
			const url = `${AJAX_EMBED}/${id}-${server}`;

			got(url, {json: true})
				.then(({body}) => {
					if (type === 'embed') {
						embedScraper(body.src)
							.then(streams => {
								if (streams) {
									for (const stream of streams) {
										stream.aggregator = 'moviesjoy';
										this.emit('stream', stream);
									}
								}

								callback();
							});
					}
				});
		}, () => {
			this.emit('finished');
		});
	}
}

module.exports = MoviesJoy;