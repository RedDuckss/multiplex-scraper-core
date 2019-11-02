const { EventEmitter } = require('events');
const got = require('got');
const async = require('async');
const { JSDOM } = require('jsdom');
const embedScraper = require('../embed');

const URL_BASE = 'https://primewire.li';
const URL_EMBED = `${URL_BASE}/links/go?embed=true`;

class PrimeWire extends EventEmitter {
	constructor() {
		super();
	}

	async scrape(traktDetails, type, season, episode) {
		let response = await got(`${URL_BASE}/?s=${traktDetails.ids.imdb}`).catch(() => {
			this.emit('finished');
			return;
		});
		const searchResults = response.body;
		let dom = new JSDOM(searchResults);
	
		const media = dom.window.document.querySelector('.index_item');
		if (!media) {
			return this.emit('finished');
		}
	
		const link = media.querySelector('a');
		if (!link) {
			return this.emit('finished');
		}
	
		let url;
		if (type === 'show') {
			const id = link.href.match(/tv\/(\d*?)-/)[1];
			const urlRest = link.href.match(/tv\/\d*?-(.*)/)[1];
			
			url = `${URL_BASE}/tv/${id}/${urlRest}-season-${season}-episode-${episode}`;
		} else {
			url = `${URL_BASE}${link.href}`;
		}
	
		response = await got(url);
		dom = new JSDOM(response.body);
	
		const embedIdList =  [...dom.window.document.querySelectorAll('.embed-link')]
			.map(element => element.getAttribute('go-key'))
			.filter(embedId => embedId);
	
		async.each(embedIdList, (embedId, callback) => {
			got(`${URL_EMBED}&key=${embedId}`, {
				json: true,
				headers: { // with the `json` key set to true, primewire sends a 406 error unless this header is set
					accept: '*/*'
				}
			}).then(({body}) => {
				embedScraper(body.link)
					.then(streams => {
						if (streams) {
							for (const stream of streams) {
								stream.aggregator = 'PrimeWire';
								this.emit('stream', stream);
							}
						}

						callback();
					});
			});
		}, () => {
			this.emit('finished');
		});
	}
}

module.exports = PrimeWire;