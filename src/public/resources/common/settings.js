/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-11 18:06:23
 * @ Modified time: 2024-11-11 20:05:22
 * @ Description:
 * 
 * Manages site settings.
 */

const Settings = (() => {

	// Interface
	const _ = {};
	const settings = [
		{ name: 'darkmode', key: 'darkmode', action: () => _.toggle_darkmode() },
		{ name: 'command palette', key: 'palette', action: () => _.toggle_palette() }
	]

	// Create the settings trigger
	const settings_trigger =
		DOM.div().c('settings').append(
			DOM.div().c('ui', 'right', 'labeled', 'icon', 'black', 'button').append(
				DOM.span().c('black', 'text').t('settings'),
				DOM.icon().c('tools', 'icon')))

	// Append the icon
	DOM.append(settings_trigger);

	// The settings elements
	const settings_element = DOM.div().c('ui', 'modal', 'settings-modal')
	DOM.append(settings_element)

	// The settings modal
	const settings_modal = DOM.stateful_modal(settings_element);
	const settings_table = DOM.stateful_table();

	// Hide the default structure of the modal LMAO
	settings_modal.select('.ui.content').display(false)
	settings_modal.select('.ui.header').display(false)
	settings_modal.select('.actions').display(false)

	// Construct the modal
	settings_element.append(
		DOM.div().c('ui', 'header', 'massive', 'text').t('Settings'),
		DOM.div().c('ui', 'divider'),
		settings_table)

	settings_table.mapper = (setting) => (
		DOM.tr().s({ height: '2.8em' }).append(
			DOM.td().append(DOM.label().c('black').t(setting.name)),
			DOM.td().c('spacer').s({ minWidth: '2em' }),
			DOM.td().append(
				DOM.checkbox()
					.check(DOM.setting(setting.key) ?? false)
					.listen('click', settings.filter(s => s.key === setting.key)[0].action))
		)
	)

	settings_table.table_data(settings)
	settings_table.table_map(settings_table.mapper)

	// Setting triggers
	settings_trigger.tooltip({ text: 'Customize site behaviour here.', label: 'ctrl + .'})
	settings_trigger.listen('click', () => settings_modal.modal_open())
	DOM.keybind({ ctrlKey: true, key: '.' }, () => settings_modal.modal_toggle())
	DOM.keybind({ key: 'Escape' }, () => settings_modal.modal_close())

	/**
	 * Toggles darkmode.
	 * 
	 * @param value		Whether or not to use darkmode. 
	 * @return				The api.
	 */
	_.set_darkmode = (value) => (
		DOM.setting('darkmode', value),
		value 
			? DOM.style({ '--black': '255, 255, 255', '--white': '27, 28, 29' })
			: DOM.style({ '--black': '16, 16, 16', '--white': '255, 255, 255' }),
		_
	)

	/**
	 * Enables / disables the command palette.
	 * 
	 * @param value		Whether or not to use the command palette. 
	 * @return				The api.
	 */
	_.set_palette = (value) => (
		DOM.setting('palette', value),
		Palette.enable(value),
		_
	)

	/**
	 * Toggles darkmode.
	 * 
	 * @return	The api. 
	 */
	_.toggle_darkmode = () => (
		_.set_darkmode(!DOM.setting('darkmode')),
		_
	)

	/**
	 * Toggles palette availability.
	 * 
	 * @return	The api. 
	 */
	_.toggle_palette = () => (
		_.set_palette(!DOM.setting('palette')),
		_
	)

	// Init the settings
	_.set_darkmode(true)
	_.set_palette(true)

	return {
		..._,
	}
})()