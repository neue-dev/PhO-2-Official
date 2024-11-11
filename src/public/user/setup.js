/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-10 07:03:19
 * @ Description:
 * 
 * Stuff that runs on every admin page.
 */

(() => {

	// ! add submit and desmos command
	Palette
	.register_command('home|dashboard', { action: () => (location.href = '/dashboard'), description: 'Opens the dashboard.' })
	.register_command('prog|progress', { action: () => (location.href = '/progress'), description: 'Opens the progress panel.' })
	.register_command('probs|problems', { action: () => (location.href = '/problems'), description: 'Opens elimination problems.' })
	.register_command('fins|finals', { action: () => (location.href = '/finals'), description: 'Opens finals GForm.' })
	.register_command('lb|board|leaderboard', { action: () => (location.href = '/leaderboard'), description: 'Opens the leaderboard.' })
	.register_command('forum', { action: () => (location.href = '/dashboard'), description: 'Opens the forum.' })
	.register_command('out|logout', { action: () => PHO2.logout(), description: 'Logs out.' })
})()
