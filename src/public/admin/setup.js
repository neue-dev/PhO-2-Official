/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-04 10:44:11
 * @ Description:
 * 
 * Stuff that runs on every admin page.
 */

(() => {
	
	/**
	 * The list of executable commands.
	 */
	const COMMANDS = {
		
		// Navigation commands		
		'home': () => COMMANDS.dashboard(),
		'dashboard': () => location.href = '/dashboard',
		'config': () => location.href = '/config',
		'progress': () => location.href = '/progress',
		'problems': () => location.href = '/problems',
		'finals': () => location.href = '/finals',
		'leaderboard': () => location.href = '/leaderboard',
		'forum': () => DOM.toast({ title: 'Click on the forum link in the dashboard instead.' }),
		'out': () => COMMANDS.logout(),
		'logout': () => PHO2.logout(),

		// Admin actions
		// ! todo, make these execute callbacks by encapsulating admin actions in its own domain object
		// 'enableofficial': () => location.href = '/enableofficial',
		// 'disableofficial': () => location.href = '/disableofficial',
		
		'slog': () => COMMANDS.submissionlog(),
		'sublog': () => COMMANDS.submissionlog(),
		'submissionlog': () => 
			X.download('./admin/submissionlog', 'test.txt', 
				({ submissions }) => submissions.map(submission => Object.values(submission).join(',')).join('\n')),
	}

	/**
	 * Runs the provided command.
	 * 
	 * @param command		The command to run. 
	 */
	const run_command = (command) => 
		(COMMANDS[command] ?? (() => DOM.toast({ title: 'Command not found.', label: 'error' })))()

	// Keybinds
	DOM.keybind({ ctrlKey: true, key: 'p' }, () => run_command(prompt('Enter command: ')))
})()
