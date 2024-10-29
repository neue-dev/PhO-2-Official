/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-29 15:07:13
 * @ Modified time: 2024-10-29 16:01:25
 * @ Description:
 * 
 * Utilities for dealing with DOM-related stuff.
 * I have no idea why older me never bothered to package code in this way.
 * Check the older version of the website... so many DRY violations... ew.
 */

const DOM = (() => {

	// Interface
	const _ = {};

	/**
	 * Decorates a DOM element with fluent helper methods.
	 * 
	 * @param element		The element to decorate. 
	 * @return 					The decorated element.
	 */
	const fluent = (element) => {
		
		// Add the methods to the object
		Object.assign(element, {
			
			// Fluent get-setter for content
			t: (text) => (
				text 
					? (element.innerHTML = text, element) 
					: (element.outerHTML)
			),

			// Fluent get-setter for class names
			c: (classes='') => (
				Array.isArray(classes)
					? (element.classList.add(...classes), element)
					: (element.classList.add(classes), element)
			),

			// Fluent get-setter for styles
			s: (styles) => (
				styles
					? (Object.keys(styles).forEach(property => element.style[property] = styles[property]), element)
					: (element.style)
			),

			// Appends content
			append: (child) => (
				child instanceof Element || child instanceof HTMLElement
					? element.appendChild(child)
					: element.innerHTML += child,
				element
			)
		})

		return element;
	}

	/**
	 * A private helper function.
	 * Creates a new element with the given tag name.
	 * 
	 * @param	tag			The tag of the element.
	 * @return				A new HTML element of the given tag with the applied styles.
	 */
	const element = (tag) => {

		// Create the element
		const e = document.createElement(tag);

		// Make fluent
		return fluent(e);
	}

	/**
	 * Element factory methods.
	 */
	_.span = () => element('span');
	_.div = () => element('div');
	_.table = () => element('table');
	_.tr = () => element('tr');
	_.td = () => element('td');
	_.b = () => element('b');

	/**
	 * Selects an element from the dom using the selector.
	 * Decorates the element with fluent helpers.
	 * 
	 * @param	selector	The selector to use.
	 * @return					The element selected.
	 */
	_.select = (selector) => fluent(document.querySelector(selector));

	return {
		..._,
	}

})();
