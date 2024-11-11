/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-29 15:07:13
 * @ Modified time: 2024-11-11 21:41:08
 * @ Description:
 * 
 * Utilities for dealing with DOM-related stuff.
 * I have no idea why older me never bothered to package code in this way.
 * Check the older version of the website... so many DRY violations... ew.
 */

const DOM = (() => {

	// Interface
	const _ = {};

	// Local storage cache
	const storage = {}

	// Stores active elements
	const active = {
		modal: null,
	};

	/**
	 * Generates a decent random uuid.
	 * Usable in secure contexts.
	 * Lifted from https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
	 * 
	 * @return	A new uuid, v4. 
	 */
	const uuidv4 = () => ( 
		"10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
			(+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
		)
	)

	/**
	 * Generates a random id for us
	 * 
	 * @return	A unique valid id string. 
	 */
	const random_id = () => '__' + uuidv4()

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
		element && decorate(element, {

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
			cis: (...classes) => (
				classes.every(c => element.classList.contains(c)
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

			// Removes all content of the element
			clear: () => (
				element.innerHTML = '',
				element
			),

			// Retrieves child by index or selector
			select: (selector) => (
				typeof selector == 'number'
					? selector < element.children.length
						?	fluent(element.children[selector])
						: null
					: element.querySelector(selector)
						? fluent(element.querySelector(selector))
						: null
			),

			// Creates a tooltip for the component
			tooltip: ({ text='', label='', delay=333, duration=1667 } = {}) => (

				// Mouse in
				element.addEventListener('mousemove', (e) => (
					
					// Put tooltip on mouse
					_.tooltip({ text, label, x: e.clientX, y: e.clientY }),

					// Replace old in timeout
					element._in_timeout && clearTimeout(element._in_timeout),
					element._in_timeout = setTimeout(() => (

						// Update tooltip
						_.tooltip().active(),

						// Replace old out timeout
						element._out_timeout && clearTimeout(element._out_timeout),
						element._out_timeout = setTimeout(() => _.tooltip().inactive(), duration)
					), delay)
				)),

				// Mouse out
				element.addEventListener('mouseout', () => (
					element._in_timeout && clearTimeout(element._in_timeout),
					element._out_timeout && clearTimeout(element._out_timeout),
					_.tooltip().inactive()
				)),

				// Return element
				element
			),

			// The parent of the element
			parent: () => (
				element.parentElement
			),

			// Adds an event listener to the object
			listen: (event, listener) => (
				element.addEventListener(event, listener),
				element
			),

			// Disptches an event to the element
			dispatch: (event) => (
				element.dispatchEvent(new Event(event)),
				element
			),

			// Fluent get-setter for styles
			s: (styles) => (
				styles != null
					? (Object.keys(styles).forEach(property => 
						styles[property].endsWith && styles[property].endsWith(' !important')
							? element.style.setProperty(property, styles[property].replace(' !important', ''), 'important')
							: element.style[property] = styles[property]), 
						element)
					: (element.style)
			),

			// Fluent get-setter for hrefs
			ref: (href) => (
				href != null
					? (element.href = href, element)
					: (element.href)
			),
			
			// Toggles an elements focus
			toggle: () => (
				document.activeElement === element
					? element.blur()
					: element.focus(),
				element
			),

			// Renames the tag of a given element
			rename: (tag) => (

				// Replaces the child, copies almost all properties
				// Note that the element loses all event listeners tho 
				((replacement) => (
					Array.from(element.attributes).map(
						attribute => replacement.a(attribute, element.a(attribute))), 
					element.parent().insertBefore(replacement, element),
					element.parent().removeChild(element)
				))(fluent(document.createElement(tag)))
			),

			display: (mode) => (
				mode 
					? element.s({ display: mode })
					: element.s({ display: 'none' }),
				element
			),

			// Appends content
			append: (...children) => (
				children.forEach(
					child =>
						child instanceof Element || child instanceof HTMLElement
							? element.appendChild(child)
							: element.innerHTML += child
				),
				element
			),

			// Removes elements
			remove: (...children) => (
				children.forEach(
					child =>
						child instanceof Element || child instanceof HTMLElement
							? element.removeChild(child)
							: element.select(child) 
								? element.removeChild(element.select(child))
								: null 		
				),
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

	// Utils for generating class or id names
	const cl_str = (cl) => `.${cl}`;
	const id_str = (id) => `#${id}`;

	/**
	 * Concatenates all the text within an element.
	 * 
	 * @param element		The element to parse. 
	 * @return					All the text in the element.
	 */
	const element_text = (element) => (
		element == null 
			? ''
			: element.nodeType === 3
				? element.textContent
				: element.nodeType === 1
					? Array.from(element.childNodes).map(child => element_text(child)).join(' ')
					: ''
	)

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
	_.br = () => element('br');

	// Table-related
	_.table = () => element('table').c('ui', 'table');
	_.thead = () => element('thead');
	_.tbody = () => element('tbody');
	_.tr = () => element('tr');
	_.td = () => element('td');
	_.th = () => element('th');

	// Form-related
	_.lbl = () => element('label')
	_.input = () => element('input')
	_.button = () => element('button').c('ui', 'button');
	_.buttons = () => element('div').c('ui', 'buttons');
	_.date = () => element('div').c('ui', 'input')
		.append(element('input').a('type', 'date'))

	// Custom components
	_.label = () => element('kbd').c('ui', 'label')
	_.or = () => element('div').c('or'),
	_.icon = () => element('i').c('icon')

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
							tabs.select(tab).c('active'),
							tabs)
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
	 * @param menu	The element (probably a div containing the items) to decorate. 
	 * @return			The decorated element.
	 */
	_.stateful_menu = (menu) => (
		
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
				menu.menu_selected_item(cl_str(DOM.select(e.target).d()))
			))),
			
			// Additional menu methods
			decorate(menu, {

				// Get-setter for selected item
				menu_selected_item: (item) => (
					item 
						? (menu.state('selected', item),
							menu.foreach(e => e.uc('active')),
							menu.select(item).c('active'),
							menu.dispatch('select'),
							menu)
						: (menu.state('selected'))
				),

				// Passes a callback to execute when an item gets selected 
				menu_on_selected: (f) => (
					menu.listen('select', (e) => f(menu.menu_selected_item(), e)),
					menu
				)

			})

		// Pass in the element
		))(
			((id) => (
				menu
					? stateful(menu, id)
					: stateful(element('div').c('menu'), id)
			))(random_id())
		)
	)

	/**
	 * Creates a stateful table with the given id.
	 * Methods are:
	 * 
	 * 	table_data()			Get-setter for the data associated with the table.
	 * 	table_header()		Setter for the table header.
	 * 	table_map()				Sets how the data maps to rows.
	 * 	table_sort()			Sorts the rows according to a comparator that works on the data.
	 * 	table_filter()		Applies a filter to the table.		
	 * 
	 * @param table		The element (probably a table element of sorts) to decorate, or null to create a new one. 
	 * @return				The decorated element.
	 */
	_.stateful_table = (table) => (

		// Extends the table
		((table) => (

			// Set up the structure
			table.append(
				element('thead').c('thead'),
				element('tbody').c('tbody').append(element('tr').append(element('td').append(
					element('div').c('ui', 'active', 'centered', 'inline', 'fast', 'large', 'loader'))))
			),

			// Add methods
			decorate(table, {
				
				// Get-setter for the table data
				table_data: (data) => (
					data != null
						? (data = data.map(d => ({ ...d, __id: random_id() })),
							table.state('data', data), 
							table.state('view', data.map(d => ({ ...d, __visible: true }))), 
							table)
						: (table.state('data'))
				),

				// Setter for the table header
				table_header: (...headers) => (
					table.select('thead').clear(),
					table.select('thead').append(element('tr')),
					headers.forEach(header =>
						table
							.select('thead')
							.select('tr')
							.append(element('th').t(header))),
					table
				),

				// Setter for the mapping of the table
				table_map: (mapper) => (
					table.select('tbody').clear(),
					table.state('view').forEach(data => 

						// Append the row generated by the mapper
						table
							.select('tbody')
							.append(mapper(data)
								.c(data.__id)
								.d(data.__id)
								.s(data.__visible 
									? {  }
									: { display: 'none !important' }))),

					// Handle empty tables
					table.state('view').filter(data => data.__visible).length || 
						table.select('tbody').append(
							element('tr').append(element('td').append(
								element('label').c('ui', 'black', 'label').t('No entries.')))),
					table
				),

				// Sorts the rows of the table
				table_sort: (comparator) => (
					table.state('view', 
						table.state('view')
							.sort(comparator))
				),
				
				// Applies a filter to the table data
				table_filter: (filter) => (

					// Update the filtered data
					table.state('view', 
						table.state('data')
							.map(d => filter(

								// Pass the data, minus our internal UUID
								({ ...d, __id: '' }), 

								// Parse the text of the element associated to the data
								element_text(
									table
										.select('tbody')
										.select(cl_str(d.__id))))
										
									// If the filter passes
									? { ...d, __visible: true }
									: { ...d, __visible: false })),
					table
				)
			})

		// Pass the element
		))(
			((id) => (
				table 
					? stateful(table, id)
					: stateful(element('table').c('table'), id)
			))(random_id())
		)
	)
	
	/**
	 * Creates a stateful modal with the given id.
	 * Methods are:
	 * 
	 * 	modal_open()					Launches the modal.
	 * 	modal_close()					Deactivates the modal.
	 * 	modal_header()				Set the header of the modal.
	 *  modal_action()				Add an action to the modal.
	 * 	modal_action_show()		Enables an action.
	 * 	modal_action_hide()		Deactivates an action.
	 * 	modal_append()				Append content to the body of the modal.
	 * 	modal_clear()					Clears the body of the modal.
	 * 
	 * @param modal 	The element to use (or null to generate a new one).
	 * @return				Returns a new modal. 
	 */
	_.stateful_modal = (modal) => (
		
		// Extend the modal
		((modal) => (

			// Replace modal with parent in the current DOM tree
			((dimmer) => (
				modal.parent().insertBefore(dimmer, modal),
				modal.parent().removeChild(modal),
				modal.listen('click', (e) => e.stopPropagation()),
				dimmer.listen('click', () => modal.modal_close()),
				dimmer.append(modal)

			// The dimmer parent
			))(
				element('div').c('ui', 'dimmer', 'modal-bg', 'modals', 'page', 'transition')
			),

			// Build the structure of the modal
			modal.append(

				// Header
				element('div').c('ui', 'header', 'huge', 'text'),

				// Content
				element('div').c('ui', 'content'),

				// Actions
				element('div').c('actions')),
				
			// Add methods to it
			decorate(modal, {

				// Toggles open and close of modal
				modal_toggle: () => (
					modal.parent().cis('visible', 'active')
						? modal.modal_close()
						: modal.modal_open(),
					modal
				),

				// Activates the modal (parent must be the dimmer)
				modal_open: () => (
					active.modal && active.modal.modal_close(), 
					active.modal = modal,
					modal.parent().c('visible', 'active'),
					modal.c('visible', 'active'),
					modal
				),

				// Hides it (parent must be the dimmer)
				modal_close: () => (
					active.modal = null,
					modal.parent().uc('visible', 'active'),
					modal.uc('visible', 'active'),
					modal
				),

				// Set the header of the modal
				modal_header: (...headers) => (
					modal.select('.header').clear(),
					modal.select('.header').append(...headers),
					modal
				),

				// Adds an action to the modal
				modal_action: (name, action) => (
					modal.select('.actions').append(
						element('div')
							.t(name)
							.c('ui', 'button', 'action', name)
							.listen('click', () => action())),
					modal
				),

				modal_action_show: (action) => (
					modal.select(`.action.${action}`).display('inline-block'),
					modal
				),

				modal_action_hide: (action) => (
					modal.select(`.action.${action}`).display(false),
					modal
				),

				// Add elements to the body of the modal
				modal_append: (...elements) => (
					modal.select('.content').append(...elements),
					modal
				),

				modal_clear: () => (
					modal.select('.content').clear(),
					modal
				)
			})
			
		// Pass the element
		))(
			((id) => (
				modal 
					? stateful(modal, id)
					: stateful(element('div').c('modal'), id)
			))(random_id())
		)
	)

	/**
	 * Creates a stateful form with the given id.
	 * Methods are:
	 * 
	 * 	form_field_value()	Get-setter for field values.
	 * 	form_field_type()		Get-setter for field types.
	 * 	form_field()				Adds a new field to the form.
	 * 	form_on_enter()			Adds an on_enter callback to each input.
	 * 	form_submit()				Submits the form.
	 * 	form_clear()				Clears field values.
	 * 
	 * @param form 	The form element (or null to create a new one).
	 * @return			The stateful form.
	 */
	_.stateful_form = (form) => (

		// Extend the form
		((form) => (

			// Add methods
			decorate(form, {

				form_field_hide: (name) => (
					form.select(`.field.${name}`).display(false),
					form
				),

				form_field_show: (name) => (
					form.select(`.field.${name}`).display('block'),
					form
				),

				// Get-setter for field values
				form_field_value: (name, value) => (
					
					// Get the appropriate field
					((field) => (
						value !== undefined
							? (field.value = value, 
								field.dispatch('input'),
								form)
							: (form.state(name))

					// Pass the field
					))(form.select(`.input.${name}`))
				),

				// Get-setter for field types
				form_field_type: (name, type, options={}) => (

					// Get the appropriate field
					((field) => (

						field
						 
							// Set the field type
							? (type && field.a('type', type),

								// Switch based on type, if specified
								(({
									text: () => (null),
									date: () => (type = 'datetime-local'),
									select: () => (options.options.map(option => 
										field.append(element('option').t(option)))),
									duration: () => (type = 'number')
								})[type] || (() => null)) (),

								// Update type then return form (or current type)
								type && field.a('type', type),
								type ? form : field.a('type'))

							// Field does not exist
							: null

					// Pass the field
					))(
						form.select(`.input.${name}`)
					)
				),

				// Adds text to the form
				form_text: (c, text) => (
					form.append(element('div').c('text', c).t(text)),
					form
				),

				// Adds new fields
				form_field: (name, attributes={}, {
					checker = (() => Promise.resolve(true)),
					mapper = ((value) => (value))
				} = {}) => (

					((name, label, field, container) => (
						
						// Append stuff to container
						field.c(name).d(name),
						container.c(name),
						container.append(label, field),

						// Append the element
						form.append(container),

						// Set field attributes and properties
						Object.keys(attributes).map(attribute => 
							field.a(attribute, attributes[attribute])),
							
						// Set the type, if specified
						attributes.type && form.form_field_type(name, attributes.type, attributes),

						// Set the value, if specified
						attributes.value && form.form_field_value(name, attributes.value),
						
						// Input field event listener
						field.listen('input', (e) => (

							// Remove existing warnings
							form.select('.form.warning') && form.select('.form.warning').t(''),
							
							// Empty field
							(field.value.trim() === '' || !field.value)
								? form.state(name, null)
							
								// Check for invalid input
								: checker(field.value)
									.then(() => (
										container.remove('.warning'),
										form.state(name, 
											typeof mapper === 'object'
												? (mapper[field.type] ?? ((value) => value))(field.value)
												: (mapper(field.value)))))
									.catch((err) => (
										container.select('.warning')
											? field.value ? null : container.remove('.warning')
											: field.value && container.append(element('div').t(err).c('warning')),
										form.state(name, null)))
						)), 
						
						// Return form
						form

					// Pass in the elements
					))(

						// Id of sorts
						attributes.key ?? name.toLowerCase(),

						// Label
						element('label').t(name),

						// Create element based on type
						attributes.type 
							? attributes.type === 'select'
								? element('select').c('input')
								: element('input').c('input')
							: element('input').c('input'),

						// The container
						// Fields are required by default
						element('div').c('field', 'req')
					)
				),

				// Sets a submit for each field when enter is pressed
				form_on_enter: (target, callback) => (
					(Array.from(form.children).map(child => 
						child.cis('field')
							? child.select('.input').listen('keydown', 
								e => e.keyCode === 13 ? callback() : null)
							: null)),
					form
				),

				// Submits the form
				form_submit: (target) => (

					// Check that all fields are valid
					Array.from(form.children).every(child => (
						child.uc('required'), 
						child.cis('field', 'req')
							? form.form_field_value(child.select('.input').d()) != null
							: true))

						// Remove warning if it exists, make request
						? (form.remove('.form.warning'), X.request(target, 'POST', 
								
								// Create payload for request
								Array.from(form.children).reduce((accumulator, child) => (
									child.cis('field') 
										? { ...accumulator, 
												[child.select('.input').d()]: 
													!child.cis('req') 
														? form.form_field_value(child.select('.input').d()) || ''
														: form.form_field_value(child.select('.input').d()) }
										: accumulator
								), {})
							))

						// Reject submission action
						: (Array.from(form.children).every(child => child.cis('field', 'req') && child.c('required')),
							form.select('.form.warning')
								? form.select('.form.warning').t('Some fields are missing or invalid.')
								: form.append(element('div').c('form', 'warning').t('Some fields are missing or invalid.')),
							Promise.reject('Some fields are missing or invalid.'))
				),

				// Clears the input values of the form
				form_clear: () => (
					Array.from(form.children).map(child => 
						child.cis('field') 
							? form.form_field_value(child.select('.input').d(), null)
							: true),
					form
				),
				
				// Return form
				form
			})

		// Pass in a randomly-generated if + the element
		))(
			((id) => (
				form 
					? stateful(form, id)
					: stateful(element('form').c('ui', 'form'), id)
			))(random_id())
		)
	)
	
	/**
	 * A toast element.
	 * Automatically removes itself from the dom afterwards.
	 * 
	 * @param param		Check out the function signature... 
	 * @return				Creates a toast.
	 */
	_.toast = ({ 
		title='', 
		message='', 
		label=null,
		label_color='red',
		duration=3333, 
		in_animation='fly up', 
		out_animation='fade left' 
	} = {}) => (
		
		((toast, toast_container) => (

			// Set the in anim
			toast
				.c(...in_animation.split(' '), 'in'),
			
			!title || title.trim().length === 0
				? null
				
				// Timeout for out anims
				: (setTimeout(() => 
					(toast
						.uc(...in_animation.split(' '), 'in')
						.c(...out_animation.split(' '), 'out'),

					// Timeout for dom removal
					setTimeout(() => toast_container.removeChild(toast), 1000)), duration),
			
					// Append to container
					toast_container.appendChild(toast)),

			// The toast itself
			toast
			
		// The toast and its container
		))(
			// Create the toast itself
			element('div').c('floating', 'toast-box', 'transition', 'visible').s({ width: '24rem' }).append(
				element('div').c('negative', 'ui', 'toast', 'visible').append(
					element('div').c('content').append(
						element('div').c('item').append(
							element('div').c('ui', 'header').t(title),
							label 
								? element('div').c('ui', 'horizontal', 'label', label_color).t(label)
								: element('div')),
						element('div').c('message').t(message)))),

			// Use existing container or create one
			_.select('.toast-container') || 
			((container) => (
				document.body.appendChild(container),
				container.s({ padding: '4rem'})
			))(element('div').c('bottom', 'right', 'ui', 'toast-container'))  
		)
	)

	/**
	 * Dserves its own component smh
	 * 
	 * @return	A checkbox component. 
	 */
	_.checkbox = () => 
		((id) => (
			((checkbox) => (
				
				// Extend it with methods
				Object.assign(checkbox, {
					
					click: () => (
						checkbox.select('input').click(),
						checkbox
					),

					check: (value) => (
						checkbox.select('input').checked = value ?? true,
						checkbox
					),

					listen: (...args) => (
						checkbox.select('input').listen(...args),
						checkbox
					)
				})

			// The checkbox element
			))(
				element('div').c('checkbox-div').append(
					element('input').c('ui', 'checkbox').a('type', 'checkbox').d(id),
					element('label').a('for', id))
			)
		
		// We need the id to associate the label with the checkbox
		))(random_id())

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
				: document.querySelector(selector) ?? console.warn(`Element ${selector} not found by selector.`)
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
				e[key].toUpperCase
					? e[key].toUpperCase() === keys[key].toUpperCase()
					: e[key] === keys[key])

				// If so, evxecute callback and prevent default
				? (e.preventDefault(), callback(e))
				: (null)
		)),

		// Return api
		_
	)

	/**
	 * Appends an element to the DOM.
	 * 
	 * @param	element		The element to append.
	 * @return					The api. 
	 */
	_.append = (element) => (
		document.body.appendChild(element),
		_
	)
	
	/**
	 * Returns a cursor API for the given element.
	 * 
	 * @param	element		The element to give a cursor to.
	 * @return					A range and selection object packaged together. 
	 */
	_.cursor = (element) => (
		((range, selection, cursor={}) => (

			// Decorate the range object
			Object.assign(cursor, {
				
				// Makes the cursor go to the start of the element
				start: () => (
					range.setStart(element.childNodes[0], 0),
					range.collapse(true),
					selection.removeAllRanges(),
					selection.addRange(range),
					cursor
				), 

				// Makes the cursor go to the end of the object
				end: () => (
					range.setStart(element, element.childNodes.length), 
					range.collapse(true),
					selection.removeAllRanges(),
					selection.addRange(range),
					cursor
				)
			}),

			cursor

		// Create the range and selection objects
		))(
			document.createRange(),
			document.getSelection()
		)
	)

	/**
	 * Get-setter for the dom tooltip.
	 * 
	 * @param x				The x-coordinate of the tooltip.
	 * @param	y				The y-coordinate of the tooltip.
	 * @param	text	 	The text of the tooltip.
	 * @param	label		The label of the tooltip.
	 * @return				The tooltip itself.
	 */
	_.tooltip = ({ x=null, y=null, text=null, label=null } = {}) => (
		x || y || text || label
			? ((tooltip) => (

				// Update tooltip details
				tooltip.select('.content').t(text ?? ''),
				label 
					? (tooltip.select('.label').display('block').t(label), 
						tooltip.select(1).display('block')) 
					: (tooltip.select('.label').display(false), 
						tooltip.select(1).display(false)),
				tooltip.s({
					left: x ? x + 'px' : tooltip.style.left,
					top: y ? y + 'px' : tooltip.style.top,
				}),

				// Return tooltip
				tooltip
			))(_.select('.tooltip'))
		: _.select('.tooltip')
	)

	/**
	 * Allows an easier way for us to set global css vars, among other things.
	 * 
	 * @param styles	The styles to set. 
	 * @return				The api.
	 */
	_.style = (styles) => (
		Object.keys(styles).map(style => document.documentElement.style.setProperty(style, styles[style])),
		_
	)

	/**
	 * Get-setter for session storage.
	 * Queries the *store*.
	 * 
	 * @param	name		The name of the property to set.
	 * @param	value		The value to set it to (optional).
	 * @return				The value of the property.
	 */
	_.store = (name, value) => (
		value !== undefined
			? (sessionStorage.setItem(name, JSON.stringify(value)), _)
			: (JSON.parse(sessionStorage.getItem(name)))
	)

	/**
	 * Get-setter for local storage.
	 * Accounts for script inits.
	 * If the localStorage is already set but we're initting, we don't override the localStorage.
	 * This is useful for website user customizations.
	 * 
	 * @param	name		The name of the property to set.
	 * @param	value		The value to set it to (optional).
	 * @return				The value last set to the property.
	 */
	_.setting = (name, value) => (
		value !== undefined
			? (storage[name] !== undefined
				? (storage[name] = value, localStorage.setItem(name, JSON.stringify(value)), value)
				: localStorage.getItem(name) !== undefined && JSON.parse(localStorage.getItem(name)) !== null
					? (storage[name] = JSON.parse(localStorage.getItem(name)))
					: (storage[name] = value, localStorage.setItem(name, JSON.stringify(value)), value))
			: JSON.parse(localStorage.getItem(name))
	)

	// Clear session storage
	sessionStorage.clear()

	// Dom setup on load
	window.onload = () => (		

		// Create tooltip
		((tooltip) => (

			// Tooltip methods
			tooltip.active = () => tooltip.c('active'),
			tooltip.inactive = () => tooltip.uc('active'),

			// Create the tooltip element
			_.append(tooltip),

			// Onlick or keypress, remove tooltip
			document.addEventListener('keydown', () => tooltip.uc('active')),
			document.addEventListener('click', () => tooltip.uc('active'))
		
		// The tooltip element
		))(
			_.div().c('tooltip').append(
				_.div().c('content'), _.div().c('ui', 'divider').s({ visibility: 'hidden' }),
				_.div().c('ui', 'teal', 'compact', 'label', 'bottom', 'left', 'attached')))
	)
	
	return {
		..._,
	}

})();
