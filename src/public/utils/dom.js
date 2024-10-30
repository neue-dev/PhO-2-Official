/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-29 15:07:13
 * @ Modified time: 2024-10-30 08:07:17
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

			// Fluent get-setter for attributes
			a: (attribute, value) => (
				value != null
					? (element.setAttribute(attribute, value), element)
					: (element.getAttribute(attribute))
			),
			
			// Fluent get-setter for content
			t: (text) => (
				text != null
					? (element.innerHTML = text, element) 
					: (element.outerHTML)
			),

			// Fluent get-setter for class names
			c: (...classes) => (
				classes.length 
					? element.classList.add(...classes)
					: true,
				element
			),

			// Unassigns classes
			uc: (...classes) => (
				element.classList.remove(...classes),
				element
			),

			// Returns the index within the parent
			i: () => (
				element.parentNode
					? Array.prototype.indexOf.call(element.parentNode.childNodes, element)
					: 0
			),

			// Retrieves child by index or selector
			select: (selector) => (
				typeof selector == 'number'
					? selector < element.children.length
						?	fluent(element.children[selector])
						: null
					: fluent(element.querySelector(selector))
			),

			// Adds an event listener to the object
			listen: (event, listener) => (
				element.addEventListener(event, listener)
			),

			// Fluent get-setter for styles
			s: (styles) => (
				styles != null
					? (Object.keys(styles).forEach(property => element.style[property] = styles[property]), element)
					: (element.style)
			),

			// Fluent get-setter for hrefs
			ref: (href) => (
				href != null
					? (element.href = href, element)
					: (element.href)
			),

			// Appends content
			append: (...children) => (
				children[0] instanceof Element || children[0] instanceof HTMLElement
					? children.map(child => element.appendChild(child))
					: children.map(child => element.innerHTML += child),
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
	
	// Misc
	_.b = () => element('b');
	_.sup = () => element('sup');
	_.span = () => element('span');
	_.div = () => element('div');
	_.link = () => element('a');

	// Table-related
	_.table = () => element('table')
		.c('ui', 'table');
	_.thead = () => element('thead');
	_.tbody = () => element('tbody');
	_.tr = () => element('tr');
	_.td = () => element('td');
	_.th = () => element('th');

	// Form-related
	_.input = () => element('input')
 	_.date = () => _.div()
		.c('ui', 'input')
		.append(_.input().a('type', 'date'))
	_.button = () => element('button')
		.c('ui', 'button');
	_.buttons = () => _.div()
		.c('ui', 'buttons');

	// Custom components
	_.accordion = () => _.div()
		.c('ui', 'accordion')
	_.grid = () => _.div()
		.c('ui', 'grid')
	_.label = () => element('kbd')
		.c('ui', 'label')
	_.or = () => _.div().c('or')

	/**
	 * Selects an element from the dom using the selector.
	 * Decorates the element with fluent helpers.
	 * 
	 * @param	selector	The selector to use.
	 * @return					The element selected.
	 */
	_.select = (selector) => 
		fluent(
			selector instanceof Element || selector instanceof HTMLElement
				? selector
				: document.querySelector(selector) ?? console.error('Element not found by selector.')
		);

	return {
		..._,
	}

})();
