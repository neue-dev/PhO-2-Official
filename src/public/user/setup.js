/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-19 21:38:06
 * @ Description:
 * 
 * Stuff that runs on every admin page.
 */

(() => {

	// IFrames
	const calculator_frame = DOM.iframe().c('pane-frame').a('src', 'https://www.desmos.com/scientific')
	const grapher_frame = DOM.iframe().c('pane-frame').a('src', 'https://www.desmos.com/calculator')
	
	// Panes
	const calculator_pane = DOM.stateful_pane().append(calculator_frame)
	const grapher_pane = DOM.stateful_pane().append(grapher_frame)

	// Append panes
	DOM.append(calculator_pane)
	DOM.append(grapher_pane)

	// ! add submit command
	Palette
		.register_command('calc|scical|calculator', { action: () => (calculator_pane.pane_show()), description: 'Opens a scientific calculator.' })
		.register_command('graph|grapher', { action: () => (grapher_pane.pane_show()), description: 'Opens a graphing calculator.' })
		.register_command('home|dashboard', { action: () => (location.href = '/dashboard'), description: 'Opens the dashboard.' })
		.register_command('prog|progress', { action: () => (location.href = '/progress'), description: 'Opens the progress panel.' })
		.register_command('probs|problems', { action: () => (location.href = '/problems'), description: 'Opens elimination problems.' })
		.register_command('fins|finals', { action: () => (location.href = '/finals'), description: 'Opens finals GForm.' })
		.register_command('lb|board|leaderboard', { action: () => (location.href = '/leaderboard'), description: 'Opens the leaderboard.' })
		.register_command('forum', { action: () => (location.href = '/dashboard'), description: 'Opens the forum.' })
		.register_command('out|logout', { action: () => PHO2.logout(), description: 'Logs out.' })
})()
