/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-28 06:26:15
 * @ Modified time: 2024-10-29 12:39:15
 * @ Description:
 * 
 * Utilities for managing the front-end of the website.
 */

/**
 * The PHO2 helper interface.
 * Check the bottom of the file for an IIFE-enclosed init.
 */
const PHO2 = (() => {

	// The interface
	const _ = {};

	// Stored constants
	const ELIMS_START = 'CONTEST_ELIMS_START'
	const ELIMS_END = 'CONTEST_ELIMS_END'
	const FINALS_START = 'CONTEST_FINALS_START'
	const FINALS_END = 'CONTEST_FINALS_END'

	/**
	 * Creates a new element with the given tag name.
	 * Styles it with the optionally provided styles object.
	 * 
	 * @param	tag			The tag of the element.
	 * @param	styles	The styling for the element.
	 * @return				A new HTML element of the given tag with the applied styles.
	 */
	const element = (tag, styles={}) => {

		// Create the element
		const e = document.createElement(tag);

		// Apply the styles
		for(property in styles)
			e.style[property] = styles[property]

		// Return the element
		return e;
	}

	/**
	 * Converts millis into a proper breakdown of secs, mins, hours, days.
	 * 
	 * @param millis	The millis to convert.
	 * @return				An object containing the secs, mins, hours, days.
	 */
	const time = (millis) => {
		return {
			seconds: 	(Math.floor(millis / 1000) 								% 60 < 10 ? '0' : '') + (Math.floor(millis / 1000) % 60),
			minutes: 	(Math.floor(millis / 1000 / 60) 					% 60 < 10 ? '0' : '') + (Math.floor(millis / 1000 / 60) % 60),
			hours: 		(Math.floor(millis / 1000 / 60 / 60) 			% 24 < 10 ? '0' : '') + (Math.floor(millis / 1000 / 60 / 60) % 24),
			days: 		(Math.floor(millis / 1000 / 60 / 60 / 24)) + ''
		}
	}

	/**
	 * Retrieves an item from local storage.
	 * 
	 * @param	name	The name of the item to get.
	 * @return			The current value of the item.
	 */
	_.get = (name) => {
		return localStorage.getItem(name);
	}

	/**
	 * Sets an item in local storage.
	 * 
	 * @param	name	The name of the item to set.
	 * @param	value	The new value of the item.
	 */
	_.set = (name, value) => {
		return localStorage.setItem(name, value);
	}

	/**
	 * Returns details about the contest time.
	 * 
	 * @return	Information about the current time with respect to the contest timeline.
	 */
	_.time = () => {

		// Grab the contest details previously obtained from server
		const elims_start		= parseInt(_.get(ELIMS_START));
		const elims_end 		= parseInt(_.get(ELIMS_END));
		const finals_start 	= parseInt(_.get(FINALS_START));
		const finals_end 		= parseInt(_.get(FINALS_END));
		const now 					= parseInt(Date.now())

		// Determine relative time
		const relative = 
				now < elims_start		? 'before-elims' 	
			: now < elims_end 		? 'during-elims' 	
			: now < finals_start 	? 'before-finals'	
			: now < finals_end 		? 'during-finals'
			: 'ended';

		// Compute based on relative time
		switch(relative) {
	
			case 'before-elims': 
				return { suffix: 'until contest start', 	time: time(elims_start - now) }
	
			case 'during-elims': 
				return { suffix: 'until elims end', 			time: time(elims_end - now) }
	
			case 'before-finals':
				return { suffix: 'until finals start', 		time: time(finals_start - now) }
	
			case 'during-finals':
				return { suffix: 'until elims end', 			time: time(finals_end - now) }
	
			case 'ended': default: 
				return { suffix: 'since contest end',			time: time(now - finals_end) }
		}
	}

	/**
	 * Creates a new span tag, with the given optional styles and attributes.
	 * 
	 * @param	text		The text content of the span tag.
	 * @param	styles	The style for the span tag.
	 * @return				A new span tag with the given styling.
	 */
	_.span = (text, styles={}) => {
		
		// Create the tag
		const span = element('span', styles);

		// Set the content
		span.innerHTML = text;

		return span;
	}

	/**
	 * Creates a request for the specific resource.
	 * Why tf does this use a callback??
	 * 
	 * @param	url				The url of the resource.
	 * @param	method		The method of the http request.
	 * @param	payload		The data (in JSON probably) to send.
	 */
	_.request = (url, method, payload={}) => {
	
		// Create the request
		const xhr = new XMLHttpRequest();

		// Promise resolve and reject
		let promise_resolve;
		let promise_reject;
		
		// Configure the request
		xhr.open(method, url, true);
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.setRequestHeader('Content-Type', 'application/json');

		// Send with the payload
		xhr.send(JSON.stringify(payload));
		
		// Listen for reponse
		xhr.onreadystatechange = function () {

			// Not yet ready
			if(this.readyState !== 4) 
				return;

			// Bad request perhaps
			if(this.status !== 200)
				return promise_reject(`Request failed with status ${this.status}`);

			// Grab data
			let data = JSON.parse(this.responseText);
			
			// Bad parse
			if(data.error)
				return promise_reject(`Failed to parse response.`);

			// Resolve the promise with the data
			return promise_resolve(data);
		};

		// Return a new promise for the data
		return new Promise((resolve, reject) => {
			promise_resolve = resolve;
			promise_reject = reject;
		})
	}

	return {
		..._,
	}

})();

/**
 * Encapsulated init.
 */
(() => {

PHO2

	// Grab the config list
	.request('./user/configlist', 'POST')
	
	// Then update localStorage with the returned config
	.then((data) => (
		data['config'].forEach((parameter) => 
			PHO2.set(parameter.key, parameter.value))
	))

	// Catch any errors
	.catch((err) => (
		console.warn(err)
	));
	
})()
