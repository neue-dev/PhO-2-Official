/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-11 18:06:23
 * @ Modified time: 2024-11-11 21:15:54
 * @ Description:
 * 
 * Manages site settings.
 */

const Settings = (() => {

	// Interface
	const _ = {};
	const settings = [
		{ name: 'darkmode', key: 'darkmode', action: () => (_.toggle_darkmode()) },
		{ name: 'command palette', key: 'command-palette', action: () => (_.toggle_command_palette()) },
		{ name: 'hide answered problems', key: 'hide-answered', action: () => (_.toggle_hide_answered(), setTimeout(() => location.reload(), 250)) }
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
			DOM.td().append(DOM.label().c('settings-label', 'black').t(setting.name)),
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

	// Get-setters
	_.command_palette = (value) => (Palette.enable(DOM.setting('command-palette', value)), DOM.setting('command-palette')) 
	_.hide_answered = (value) => (DOM.setting('hide-answered', value))
	_.darkmode = (value) => (DOM.setting('darkmode', value),
		DOM.setting('darkmode')
			? DOM.style({ '--black': '255, 255, 255', '--white': '27, 28, 29' })
			: DOM.style({ '--black': '16, 16, 16', '--white': '255, 255, 255' }),
		DOM.setting('darkmode')
	)

	// Togglers
	_.toggle_darkmode = () => (_.darkmode(!DOM.setting('darkmode')), _)
	_.toggle_command_palette = () => (_.command_palette(!DOM.setting('command-palette')), _)
	_.toggle_hide_answered = () => (_.hide_answered(!DOM.setting('hide-answered')), _)

	// Init the settings
	_.darkmode(DOM.setting('darkmode', true))
	_.command_palette(DOM.setting('palette', true))
	_.hide_answered(DOM.setting('answered', true))

	return {
		..._,
	}
})()