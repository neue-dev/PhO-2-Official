/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-07 13:15:20
 * @ Modified time: 2024-11-10 06:52:25
 * @ Description:
 * 
 * Handles the command palette interface.
 */

const Palette = (() => {
	
	// Interface
	const _ = {};

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
			// .a('placeholder', 'type command here')
			.a('spellcheck', false)

	// Helper function
	palette_input.input = () => palette_input.textContent.trim()
	
	// List of commands
	const palette_table = DOM.stateful_table().s({ border: 'none' })
	
	// Create the palette element structure
	palette_element.append(palette_input, DOM.div().c('ui', 'divider'), DOM.br(), palette_table)

	// Append to the dom
	DOM.append(palette_element);

	// The palette object
	const palette = DOM.stateful_modal(palette_element);

	// Focusing and unfocusing 
	DOM.keybind({ ctrlKey: true, key: 'p' }, () => (palette.modal_toggle(), palette_input.toggle(), _.display_commands()));
	DOM.keybind({ key: 'Escape' }, () => (palette.modal_close(), palette_input.blur()));

	// Other key event listeners
	palette_input.listen('input', (e) => (
		[ 'insertLineBreak', 'insertParagraph' ].includes(e.inputType)  
			? (_.run_command(e.target.input()), e.target.textContent = e.target.input().replaceAll('\n', ''))
			: (_.filter_commands(e.target.input()), _.display_commands())))

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

				// Create the command identifier (labels)
				identifier.t(command.names.map(name =>
					name === filter_key.trim()
						? (row.s({ color: 'rgb(102, 255, 102)' }), identifier.s({ backgroundColor: 'rgb(102, 255, 102)' }), name)
						: name.replace(filter_key, DOM.span().s({ color: 'rgb(65, 80, 200)' }).t(filter_key).t())).join('/')),

				// Actual command row information
				row.s({ height: '2.4em' }).append(
					DOM.td().append(identifier),
					DOM.td().c('spacer').s({ width: '1em' }),
					DOM.td().t(command.description).s({ opacity: 0.33 }))
			))
			(DOM.tr(), DOM.div().c('ui', 'basic', 'compact', 'label').s({ backgroundColor: 'rgba(255, 255, 255, 0.75)' }))
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
	 * Runs a given command with the given name, if it exists.
	 * If more than once match occurs, the first one is chosen.
	 * 
	 * @param name	The name of the command to run. 
	 * @return			The api.
	 */
	_.run_command = (name) => (
		console.log(name),
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
			palette_input.a('data-content', matches.length ? filter_key === '' ? '' : matches[0] : ''), 

			// Table filter
			palette_table.mapper = palette_mapper_factory(filter_key),
			palette_table.table_filter((command) => command.names.some(name => name.includes(filter_key)))

		// Compute all the matching names
		))(commands.map(command => command.names.filter(name => name.includes(filter_key))).flat()),
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