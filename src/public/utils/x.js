/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-29 17:51:10
 * @ Modified time: 2024-10-29 17:51:51
 * @ Description:
 * 
 * Handles cross (x) requests and other network matters.
 */

const X = (() => {

	// Interface
	const _ = {};

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
