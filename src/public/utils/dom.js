/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-29 15:07:13
 * @ Modified time: 2024-10-30 13:36:55
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
	 * A conciser and more expressive syntax for decorating elements.
	 * 
	 * @param element				The element to decorate. 
	 * @param decorations 	The decorations to put on the element.
	 * @return							The decorated element. 
	 */
	const decorate = (element, decorations) => (
		Object.assign(element, decorations),
		element
	)

	/**
	 * Decorates a DOM element with fluent helper methods.
	 * 
	 * @param element		The element to decorate. 
	 * @return 					The decorated element.
	 */
	const fluent = (element) => (
		
		// Add the methods to the object
		decorate(element, {

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

			// Get-setter for id
			d: (id) => (
				id != null
					? (element.id = id, element)
					: (element.id)
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

			// Removes all children of the element
			clear: () => (
				element.foreach(child => 
					element.removeChild(child)),
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

			// The parent of the element
			parent: () => (
				element.parentElement
			),

			// Adds an event listener to the object
			listen: (event, listener) => (
				element.addEventListener(event, listener)
			),

			// Disptches an event to the element
			dispatch: (event) => (
				element.dispatchEvent(new Event(event))
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
			? (decorate(element, { state: (name, value) => _.store(`${id}.${name}`, value), }), element)
			: (pending_id) => stateful(element, pending_id).c(id).d(id)
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
	 * 	tabs_active_tab()		Get-setter for active tab.
	 * 
	 * @param id		Identifier for the element and its store in localStorage. 
	 * @param tabs	The element (probably a div containing the tabs) to decorate. 
	 * @return			The decorated element.
	 */
	_.stateful_tabs = (id, tabs) => (
		
		// Extends the tabs object
		((tabs) => (

			// Additional tabs methods
			decorate(tabs, {

				// Get-setter for the active tab
				tabs_active_tab: (tab) => (
					tab 
						? (tabs.state('active', tab), 
							tabs.foreach(child => child.uc('active')),
							tabs.select(tab).c('active'))
						: (tabs.state('active'))
				),
			})

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
	 * 	menu_selected_item()		Get-setter for selected item.
	 * 	menu_on_selected()			Sets what to do after an item gets selected.
	 * 
	 * @param id		Identifier for the element and its store in localStorage. 
	 * @param menu	The element (probably a div containing the items) to decorate. 
	 * @return			The decorated element.
	 */
	_.stateful_menu = (id, menu) => (
		
		// Extends the menu
		((menu) => (

			// Make sure each tab gets a class and id equal to its ref
			menu.foreach(e => ((c) => (
				e.c(c),
				e.d(c)

			// Pass in the value
			))(e.ref().split('/').at(-1))),

			// Add event listeners for tab selection
			menu.foreach(e => e.listen('click', (e) => (
				
				// Avoid relocating page
				e.preventDefault(),

				// Select the right item
				menu.menu_selected_item(`.${DOM.select(e.target).d()}`)
			))),
			
			// Additional menu methods
			decorate(menu, {

				// Get-setter for selected item
				menu_selected_item: (item) => (
					item 
						? (menu.state('selected', item),
							menu.foreach(e => e.uc('active')),
							menu.select(item).c('active'),
							menu.dispatch('select'))
						: (menu.state('selected'))
				),

				// Passes a callback to execute when an item gets selected 
				menu_on_selected: (f) => (
					menu.listen('select', (e) => f(menu.menu_selected_item(), e))
				)

			})

		// Pass in the element
		))(
			menu
				? stateful(menu, id)
				: stateful(element('div').c('menu'), id)
		)
	)

	/**
	 * Creates a stateful table with the given id.
	 * Methods are:
	 * 
	 * 	table_data()			Get-setter for the data associated with the table.
	 * 	table_map()				Sets how the data maps to rows.
	 * 	table_filter()		Applies a filter to the table.		
	 * 
	 * @param id			Identifier for the element and its store in localStorage. 
	 * @param table		The element (probably a table element of sorts) to decorate. 
	 * @return				The decorated element.
	 */
	_.stateful_table = (id, table) => (

		// Extends the table
		((table) => (

			// Set up the structure
			table.append(
				element('thead').c('thead'),
				element('tbody').c('tbody')
			),

			// Add methods
			decorate(table, {
				
				// Get-setter for the table data
				table_data: (data) => (
					table.state('data', data),
					table.state('view', data)
				),

				// Setter for the table header
				table_header: (...headers) => (
					table.select('thead').clear(),
					table.select('thead').append(element('tr')),
					headers.forEach(header =>
						table.select('thead').select('tr').append(element('th').t(header)))
				),

				// Setter for the mapping of the table
				table_map: (mapper) => (
					table.select('tbody').clear(),
					table.state('view').forEach(data => 
						table.select('tbody').append(mapper(data)))
				),
				
				// Applies a filter to the table data
				table_filter: (filter) => data.state('view', filter(data.state('data')))
			})

		// Pass the element
		))(
			table 
				? stateful(table, id)
				: stateful(element('table').c('table'), id)
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
			? (localStorage.setItem(name, JSON.stringify(value)), _)
			: (JSON.parse(localStorage.getItem(name)))
	)
	
	return {
		..._,
	}

})();
