/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-29 17:51:10
 * @ Modified time: 2024-11-04 10:15:50
 * @ Description:
 * 
 * Handles cross (x) requests and other network matters.
 */

const X = (() => {

	// Interface
	const _ = {};

	/**
	 * A download helper function.
	 * Adopted from my old code from god knows where.
	 * 
	 * @param filename	The filename to save. 
	 * @param text			The content of the file.
	 */
	const download = (filename, text) => {

		let a = document.createElement('a');
		a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		a.setAttribute('download', filename);
		a.style.display = 'none';
	
		document.body.appendChild(a); a.click();
		document.body.removeChild(a);
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
				return promise_reject(JSON.parse(this.responseText))

			// Grab data
			let data = JSON.parse(this.responseText);
			
			// Bad parse
			if(data.error)
				return promise_reject({ error: 'Failed to parse response' });

			// Resolve the promise with the data
			return promise_resolve(data);
		};

		// Return a new promise for the data
		return new Promise((resolve, reject) => {
			promise_resolve = resolve;
			promise_reject = reject;
		})
	}

	/**
	 * Downloads the file with the given filename.
	 * 
	 * @param	url				The location of the file.
	 * @param	filename	The name to save.
	 * @param	mapper		Maps the data to the representation in the file.
	 */
	_.download = (url, filename, mapper=((data) => JSON.stringify(data))) => {
		X.request(url, 'POST', {}).then(data => (
			download(filename, mapper(data))
		))
	}

	return {
		..._,
	}

})();
