/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-04 07:45:39
 * @ Description:
 * 
 * A minimal preloader for assets.
 * Just used for images for now.
 */

const Preload = (() => {

	// Interface
	const _ = {};

	// Stack of images to preload
	const stack = [];

	/**
	 * Returns an array containing the props of the promise.
	 * 
	 * @return	The promise, resolver, and rejecter.
	 */
	const create_promise = () => {

		// Promise deets
		let on_resolve = null
		let on_reject = null
		const promise = new Promise((resolve, reject) => (
			on_resolve = resolve,
			on_reject = reject
		))

		return [ promise, on_resolve, on_reject ];
	}

	/**
	 * Pushes a new image to preload.
	 * 
	 * @param src			The source of the image.
	 * @param styles 	Optional image inline styles.
	 * @param parent	The parent of the image.
	 * @return				The api.
	 */
	_.queue = (src, styles={}, parent=document.body) => {

		// Create the promise
		const [ promise, resolve, reject ] = create_promise();

		// Create the image
		const img = new Image();
		const index = stack.length;

		// When it loads, check if prev image has resolved already
		img.onload = () => {

			// First image
			if(!index)
				return (parent.appendChild(img), resolve(img));

			// Otherwise, wait for prev
			stack[index - 1].then(() => (
				parent.appendChild(img),
				resolve(img)
			))
		};

		// Set src and other attribs
		img.src = src;
		img.classList.add('preload-image')
		img.classList.add(...(styles?.c.split(' ') || []))

		// Push the promise to the stack
		stack.push(promise);

		return _
	}

	/**
	 * Appends a promise to the current promise of the stack.
	 * 
	 * @param		f		A function to append.
	 * @return			A promise all. 
	 */
	_.then = (f) => (
		Promise.all(stack).then((...args) => f(...args)),
		_
	)

	return {
		..._,
	}
})();
