const parseDomain = require('parse-domain');
const hostScrapers = require('./hosts');

async function scrapeEmbed(embed) {
	const streams = [];
	const {domain, tld} = parseDomain(embed);
	const _domain = `${domain}.${tld}`;

	switch (_domain) {
		case 'mp4upload.com':
			const mp4upload = await hostScrapers.MP4Upload.scrape(embed);
			if (mp4upload) {
				streams.push({
					file_host: 'mp4upload',
					file: mp4upload
				});
			}
			break;

		case 'putlockertv.biz':
			const verystream = await hostScrapers.VeryStream.scrape(embed);
			if (verystream) {
				streams.push({
					file_host: 'VeryStream',
					file: verystream
				});
			}
			break;

		case 'gounlimited.to':
			const gounlimited = await hostScrapers.GoUnlimited.scrape(embed);
			if (gounlimited) {
				for (const stream of gounlimited) {
					streams.push({
						file_host: 'GoUnlimited',
						file: stream
					});
				}
			}
			break;

		case 'gomostream.com':
		case 'viduplayer.com':
			const viduplayer = await hostScrapers.ViduPlayer.scrape(embed);
			if (viduplayer) {
				for (const stream of viduplayer) {
					streams.push({
						file_host: 'ViduPlayer',
						file: stream.file,
						quality: stream.label,
					});
				}
			}
			break;

		case 'idtbox.com':
			const idtbox = await hostScrapers.IDTBox.scrape(embed);
			if (idtbox) {
				streams.push({
					file_host: 'IDTBox',
					file: idtbox
				});
			}
			break;

		case 'vidoza.net':
			const vidoza = await hostScrapers.Vidoza.scrape(embed);
			if (vidoza) {
				streams.push({
					file_host: 'Vidoza',
					file: vidoza
				});
			}
			break;

		case 'clipwatching.com':
			const clipwatching = await hostScrapers.ClipWatching.scrape(embed);
			if (clipwatching) {
				for (const stream of clipwatching) {
					streams.push({
						file_host: 'ClipWatching',
						file: stream.file,
						quality: stream.label,
					});
				}
			}
			break;

		case 'flix555.com':
			const flix555 = await hostScrapers.Flix555.scrape(embed);
			if (flix555) {
				for (const stream of flix555) {
					streams.push({
						file_host: 'Flix555',
						file: stream.file,
						quality: stream.label,
					});
				}
			}
			break;

		case 'unlimitedpeer.ru':
			const unlimitedpeer = await hostScrapers.UnlimitedPeer.scrape(embed);
			if (unlimitedpeer) {
				streams.push({
					file_host: 'UnlimitedPeer',
					file: unlimitedpeer
				});
			}
			break;

		case 'megaxfer.ru':
			const megaxfer = await hostScrapers.Megaxfer.scrape(embed);
			if (megaxfer) {
				for (const stream of megaxfer) {
					streams.push({
						file_host: 'Megaxfer',
						file: stream.file
					});
				}
			}
			break;

		case 'fembed.com':
			const fembed = await hostScrapers.FEmbed.scrape(embed);
			if (fembed) {
				for (const stream of fembed) {
					streams.push({
						file_host: 'FEmbed',
						file: stream.file,
						quality: stream.quality,
					});
				}
			}
			break;
		
		case 'vidlox.me':
			const vidlox = await hostScrapers.VidLox.scrape(embed);
			if (vidlox) {
				for (const stream of vidlox) {
					streams.push({
						file_host: 'VidLox',
						file: stream
					});
				}
			}
			break;

		case 'onlystream.tv':
			const onlystream = await hostScrapers.OnlyStream.scrape(embed);
			if (onlystream) {
				for (const stream of onlystream) {
					streams.push({
						file_host: 'OnlyStream',
						file: stream.file,
						quality: stream.label
					});
				}
			}
			break;

		case 'vidsource.me':
			const vidsource = await hostScrapers.VidSource.scrape(embed);
			if (vidsource) {
				for (const stream of vidsource) {
					streams.push({
						file_host: 'VidSource',
						file: stream.file,
						quality: stream.label
					});
				}
			}
			break;
			
		case 'openload.co':    // DEAD
		case 'openload.io':    // DEAD
		case 'openload.link':  // DEAD
		case 'oload.tv':       // DEAD
		case 'oload.stream':   // DEAD
		case 'oload.site':     // DEAD
		case 'oload.xyz':      // DEAD
		case 'oload.win':      // DEAD
		case 'oload.download': // DEAD
		case 'oload.cloud':    // DEAD
		case 'oload.cc':       // DEAD
		case 'oload.icu':      // DEAD
		case 'oload.fun':      // DEAD
		case 'streamango.com': // DEAD
		case 'fruithosts.net': // DEAD
		case 'rapidvideo.com': // DEAD
		case 'verystream.com': // DEAD
		case 'vev.io': // captcha
		case 'powvideo.net': // captcha
		case 'gorillavid.in': // dead
		case 'daclips.in': // dead
		case 'movpod.in': // dead
		case 'thevideo.me': // broken site
		case 'streamplay.to': // captcha
		case 'vidcloud.co': // CF, and down
		case 'flashx.tv': // Site seems broken, can't test emebed links
		case 'gamovideo.com': // broken site
		case 'vidtodo.com': // broken site
		case 'vidup.io': // broken site
		case 'vidup.me': // broken site
		case 'vidzi.tv': // cant find working embed to test
		case 'vidto.me': // cant find working embed to test
		case 'vidlox.tv': // cant find working embed to test
		case 'waaw.tv': // captcha
		case 'hqq.tv': // broken site
		case 'vshare.eu': // doesn't throw http error on invalid embed, just times out
			break;

		default:
			console.log('Unknown embed host', embed);
			break;
	}

	return streams;
}

module.exports = scrapeEmbed;