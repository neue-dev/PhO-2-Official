/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-11 18:06:23
 * @ Modified time: 2024-11-11 18:24:01
 * @ Description:
 * 
 * Manages site settings.
 */

const Settings = (() => {

	// Interface
	const _ = {};

	// Create the settings icon
	const settings =
		DOM.div().c('settings').append(
			DOM.div().c('ui', 'right', 'labeled', 'icon', 'black', 'button').append(
				DOM.span().c('text').t('settings'),
				DOM.icon().c('tools', 'icon')))

	// Append the icon
	DOM.append(settings);

	// The settings elements
	const settings_element = DOM.div().c('settings-modal')
	DOM.append(settings_element)

	// The settings modal
	const settings_modal = DOM.stateful_modal(settings_element);
	settings.listen('click', () => settings_modal.modal_open())

	// Hide the default structure of the modal LMAO
	settings_modal.select('.ui.content').display(false)
	settings_modal.select('.ui.header').display(false)
	settings_modal.select('.actions').display(false)

	// Escape settings
	DOM.keybind({ key: 'Escape' }, () => settings_modal.modal_close())

	/**
	 * Toggles darkmode.
	 * 
	 * @param value		Whether or not to use darkmode. 
	 * @return				The api.
	 */
	_.setting_darkmode = (value) => (
		DOM.setting('darkmode', value),
		value 
			? DOM.style({ '--black': '255, 255, 255', '--white': '27, 28, 29' })
			: DOM.style({ '--black': '16, 16, 16', '--white': '255, 255, 255' }),
		_
	)

	// Init the settings
	_.setting_darkmode(DOM.setting('darkmode'))
})()