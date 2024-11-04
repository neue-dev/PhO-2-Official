/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-04 10:04:30
 * @ Description:
 * 
 * Stuff that runs on every admin page.
 */

(() => {
	
	/**
	 * Runs the provided command.
	 * 
	 * @param command		The command to run. 
	 */
	const run_command = (command) => (({
		
		// Navigation commands
		'dashboard': () => location.href = '/dashboard',
		'config': () => location.href = '/config',
		'progress': () => location.href = '/progress',
		'problems': () => location.href = '/problems',
		'finals': () => location.href = '/finals',
		'leaderboard': () => location.href = '/leaderboard',
		'forum': () => DOM.toast({ title: 'Click on the forum link in the dashboard instead.' }),
		'logout': () => PHO2.logout(),

		// Problem and submissions
		'submit': () => (
			location.href.endsWith('/progress')
				? alert('click on a problem first')
				: location.href = '/progress'
		)

	})[command] ?? (() => DOM.toast({ title: 'Command not found.', label: 'error' })))()

	// Keybinds
	DOM.keybind({ ctrlKey: true, key: 'p' }, () => run_command(prompt('Enter command: ')))
})()
