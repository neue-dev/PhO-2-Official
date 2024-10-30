/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-29 15:07:13
 * @ Modified time: 2024-10-30 11:20:05
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
	const fluent = (element) => (
		
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

			// Returns whether or not the element belongs to the specified classes
			is: (...classes) => (
				classes.every(c => element.contains(c)
					? true
					: false)
			),

			// Applies a function to each child
			foreach: (f) => (
				Array.from(element.children)
					.map(e => fluent(e))
					.forEach(e => f(e)),
				element
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
		}),

		// Return element
		element
	)

	/**
	 * Adds state management methods to the element.
	 * If an identifier is not provided, the function is curried until one is.
	 * Adds the method 'state()', which is a get-setter for state associated with the element
	 * 
	 * @param element		The element to decorate.
	 * @param	id				An identifier for accessing the store.
	 * @return					The decorated element.
	 */
	const stateful = (element, id) => (
		id != null
			? (Object.assign(element, { state: (name, value) => _.store(`${id}.${name}`, value), }), element)
			: (pending_id) => stateful(element, pending_id)
	)

	/**
	 * A private helper function.
	 * Creates a new element with the given tag name.
	 * By default, the element is "fluent" (decorated with lots of helper methods).
	 * Not exactly what the term means, but most of the added methods *are* fluent anyway.
	 * 
	 * @param	tag			The tag of the element.
	 * @return				A new HTML element of the given tag with the applied styles.
	 */
	const element = (tag) => fluent(document.createElement(tag))

	/**
	 * Basic element factory methods.
	 * These produce fluent elements.
	 */
	
	// Misc
	_.b = () => element('b');
	_.sup = () => element('sup');
	_.span = () => element('span');
	_.div = () => element('div');
	_.link = () => element('a');
	_.pre = () => element('pre');

	// Table-related
	_.table = () => element('table').c('ui', 'table');
	_.thead = () => element('thead');
	_.tbody = () => element('tbody');
	_.tr = () => element('tr');
	_.td = () => element('td');
	_.th = () => element('th');

	// Form-related
	_.input = () => element('input')
	_.button = () => element('button').c('ui', 'button');
	_.buttons = () => element('div').c('ui', 'buttons');
	_.date = () => element('div').c('ui', 'input')
		.append(element('input').a('type', 'date'))

	// Custom components
	_.label = () => element('kbd').c('ui', 'label')
	_.or = () => element('div').c('or')

	/**
	 * Stateful element factory methods.
	 * These produce stateful and fluent elements.
	 * This part has more documentation, and I think that's justified.
	 */

	/**
	 * Creates a stateful set of tabs with the given id.
	 * Methods are:
	 * 
	 * 	active_tab()	Get-setter for active tab.
	 * 
	 * @param id		Identifier for the element and its store in localStorage. 
	 * @param tabs	The element (probably a div containing the tabs) to decorate. 
	 * @return			The decorated element.
	 */
	_.stateful_tabs = (id, tabs) => (
		
		// Extends the tabs object
		((tabs) => (

			// Additional tabs methods
			Object.assign(tabs, {

				// Get-setter for the active tab
				active_tab: (tab) => (
					tab 
						? (tabs.state('active', tab), 
							tabs.foreach(child => child.uc('active')),
							tabs.select(tab).c('active'))
						: (tabs.state('active'))
				),
			}),

			// Return it
			tabs

		// Pass in the element
		))(
			tabs
				? stateful(tabs, id)
				: stateful(element('div').c('tabs'), id)
		)
	)

	/**
	 * Creates a stateful menu with the given id.
	 * Methods are:
	 * 
	 * 	selected_item()		Get-setter for selected item.
	 * 
	 * @param id		Identifier for the element and its store in localStorage. 
	 * @param menu	The element (probably a div containing the items) to decorate. 
	 * @return			The decorated element.
	 */
	_.stateful_menu = (id, menu) => (
		
		// Extends the menu
		((menu) => (

			// Make sure each tab gets a class equal to its ref
			menu.foreach(e => e.c(e.ref().split('/').at(-1))),
			
			// Additional menu methods
			Object.assign(menu, {

				// Get-setter for selected item
				selected_item: (item) => (
					item 
						? (menu.state('selected', item),
							menu.foreach(e => e.uc('active')),
							menu.select(item).c('active'))
						: (menu.state('selected'))
				),

			}),

			// Return it
			menu

		// Pass in the element
		))(
			menu
				? stateful(menu, id)
				: stateful(element('div').c('menu'), id)
		)
	)

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

	/**
	 * Adds a keybind to the browser for a specific action.
	 * 
	 * @param	keys			The keys to use for triggering the sequence.
	 * @param	callback	The callback to execute upon key sequence.
	 * @return 					The api itself.
	 */
	_.keybind = (keys, callback) => (

		// Add event listener
		document.addEventListener('keydown', (e) => (
			
			// Check if every provided key is pressed
			Object.keys(keys).every(key => 
				keys[key].charCodeAt 
					? e[key] === keys[key].toUpperCase().charCodeAt(0)
					: e[key])

				// If so, evxecute callback and prevent default
				? (e.preventDefault(), callback(e))
				: (null)
		)),

		// Return api
		_
	)

	/**
	 * Get-setter for local storage.
	 * Queries the *store*.
	 * 
	 * @param	name		The name of the property to set.
	 * @param	value		The value to set it to (optional).
	 * @return				The value of the property.
	 */
	_.store = (name, value) => (
		value != null
			? (localStorage.setItem(name, value), _)
			: (localStorage.getItem(name))
	)
	
	return {
		..._,
	}

})();
