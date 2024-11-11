/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-07 13:15:20
 * @ Modified time: 2024-11-11 11:46:23
 * @ Description:
 * 
 * Handles the command palette interface.
 */

const Palette = (() => {
	
	// Interface
	const _ = {};

	// Some constants
	const WHITE = 'rgb(255, 255, 255)'
	const BLUE = 'rgb(65, 80, 200)'
	const GREEN = 'rgb(102, 255, 102)'

	// The commands
	const commands = [];

	// Create the palette dom component
	const palette_element = 
		DOM.div()
			.c('ui', 'modal', 'palette')
	
	// The input element
	const palette_input = 
		DOM.div()
			.c('ui', 'input', 'palette')
			.s({ color: 'white' })
			.a('contenteditable', true)
			.a('spellcheck', false)

	// The cursor object
	const palette_cursor = DOM.cursor(palette_input);
	const palette_shadow = DOM.div().c('ui', 'input', 'palette', 'shadow')

	// Helper function, we're just saving it as a property of the element
	palette_input.input = () => palette_input.textContent.trim()

	// Autocomplete on tab
	palette_input.listen('keydown', (e) => (e.keyCode === 9 && (e.preventDefault(), _.autocomplete())))
	
	// List of commands
	const palette_table = DOM.stateful_table().s({ border: 'none' })
	
	// Create the palette element structure
	palette_element.append(palette_input, palette_shadow, DOM.div().c('ui', 'divider'), DOM.br(), palette_table)

	// Append to the dom
	DOM.append(palette_element);

	// The palette object
	const palette = DOM.stateful_modal(palette_element);

	// Focusing and unfocusing 
	DOM.keybind({ ctrlKey: true, key: 'p' }, () => (palette.modal_toggle(), palette_input.toggle(), _.display_commands()));
	DOM.keybind({ key: 'Escape' }, () => (palette.modal_close(), palette_input.blur()));

	// Other key event listeners
	palette_input.listen('input', (e) => (

		// Run command on enter, otherwise just filter displayed commands
		[ 'insertLineBreak', 'insertParagraph' ].includes(e.inputType)  
			? (_.run_command(palette_input.input()), palette_input.textContent = palette_input.input().replaceAll('\n', ''), palette_cursor.end())
			: (_.filter_commands(palette_input.input()), _.display_commands()),
		
		// Change the recommendation shadow
		palette_input.input().length 
			? palette_shadow.t(palette_input.recommendation) 
			: palette_shadow.t('')))

	/**
	 * Creates a mapper for palette rows with the filter_key highlighted.
	 * 
	 * @param	filter_key	The filter key to highlight in the rows.
	 * @return						A mapper function that maps data to rows.
	 */
	const palette_mapper_factory = (filter_key) => (
		
		// Return a new function
		(command) => (
			((row, identifier) => (

				// Fill in the text on click
				row.listen('click', (e) => (
					palette_input.textContent = command.names[0],
					palette_input.dispatch('input'),
					palette_input.focus(),
					palette_cursor.end()
				)),

				// Create the command identifier (labels)
				identifier.t(command.names.map(name =>
					name === filter_key.trim()
						? (identifier.s({ backgroundColor: GREEN }),
							row.s({ color: GREEN }), 
							name)
						: name.replace(
								filter_key, 
								DOM.span().s({ color: BLUE }).t(filter_key).t()
							)).join('/')),

				// Actual command row information
				row.s({ height: '2.4em' }).append(
					DOM.td().append(identifier),
					DOM.td().c('spacer').s({ width: '1em' }),
					DOM.td().t(command.description).s({ opacity: 0.33 }))
			))

			// Create the row and the identifier
			(DOM.tr().c('hoverable-row'), 
			DOM.div().c('ui', 'basic', 'compact', 'label').s({ backgroundColor: WHITE, opacity: 0.7, fontWeight: 400 }))
		)
	)

	// Table mapper and initial table setup
	palette_table.table_data(commands)
	palette_table.mapper = palette_mapper_factory('')

	/**
	 * Opens the command palette. 
	 */
	_.open = () => (
		null
	)

	/**
	 * Closes the command palette.
	 */
	_.close = () => (
		null
	)

	/**
	 * Performs autocomplete and fills the text content of the input with the recommendation.
	 * 
	 * @return	The api. 
	 */
	_.autocomplete = () => (
		palette_input?.recommendation?.length 
			? (palette_input.textContent = palette_input.recommendation, palette_input.dispatch('input'), palette_cursor.end())
			: null,
		_
	)

	/**
	 * Runs a given command with the given name, if it exists.
	 * If more than once match occurs, the first one is chosen.
	 * 
	 * @param name	The name of the command to run. 
	 * @return			The api.
	 */
	_.run_command = (name) => (
		((matches) => (
			matches.length ? matches[0].action() : console.error('Command not found')
		))(commands.filter(command => command.names.includes(name))),
		_
	)

	/**
	 * Registers commands to be used by the palette.
	 * 
	 * @param	command				The name of the command.
	 * @param	action				A callback that executes when command is called.
	 * @param	description		A short description of the command.
	 * @return							The api.
	 */
	_.register_command = (command, { action=()=>null, description='' } = {}) => (
		commands.push({ names: command.split('|').map(c => c.trim()), action, description }),
		palette_table.table_data(commands),
		_
	)

	/**
	 * Filters the commands by the names they have.
	 * 
	 * @param filter_key	The key to use for filtering. 
	 * @return						The api.
	 */
	_.filter_commands = (filter_key) => (

		// Filter the table AND update the value of the input
		((matches) => (

			// Mock autocomplete
			palette_input.recommendation = matches.length ? filter_key === '' ? '' : matches[0] : '', 

			// Table filter
			palette_table.mapper = palette_mapper_factory(filter_key),
			palette_table.table_filter((command) => command.names.some(name => name.includes(filter_key)))

		// Compute all the matching names
		))(commands.map(command => command.names.filter(name => name.startsWith(filter_key))).flat()),
		_
	)

	/**
	 * Displays all the available commands through the interface.
	 * 
	 * @return	The api.
	 */
	_.display_commands = () => (
		palette_table.table_map(palette_table.mapper),
		_
	)

	return {
		..._,
	}

})();