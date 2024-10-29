/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-28 06:26:15
 * @ Modified time: 2024-10-29 18:08:40
 * @ Description:
 * 
 * Utilities for managing the front-end of the website.
 */

/**
 * The PHO2 helper interface.
 * Check the bottom of the file for an IIFE-enclosed init.
 */
const PHO2 = (() => {

	// The interface
	const _ = {};

	// Stored constants
	const ELIMS_START = 'CONTEST_ELIMS_START'
	const ELIMS_END = 'CONTEST_ELIMS_END'
	const FINALS_START = 'CONTEST_FINALS_START'
	const FINALS_END = 'CONTEST_FINALS_END'

	/**
	 * Converts millis into a proper breakdown of secs, mins, hours, days.
	 * 
	 * @param millis	The millis to convert.
	 * @return				An object containing the secs, mins, hours, days.
	 */
	const time = (millis) => {
		return {
			seconds: 	(Math.floor(millis / 1000) 								% 60 < 10 ? '0' : '') + (Math.floor(millis / 1000) % 60),
			minutes: 	(Math.floor(millis / 1000 / 60) 					% 60 < 10 ? '0' : '') + (Math.floor(millis / 1000 / 60) % 60),
			hours: 		(Math.floor(millis / 1000 / 60 / 60) 			% 24 < 10 ? '0' : '') + (Math.floor(millis / 1000 / 60 / 60) % 24),
			days: 		(Math.floor(millis / 1000 / 60 / 60 / 24)) + ''
		}
	}

	/**
	 * Retrieves an item from local storage.
	 * 
	 * @param	name	The name of the item to get.
	 * @return			The current value of the item.
	 */
	_.get = (name) => {
		return localStorage.getItem(name);
	}

	/**
	 * Sets an item in local storage.
	 * 
	 * @param	name	The name of the item to set.
	 * @param	value	The new value of the item.
	 */
	_.set = (name, value) => {
		return localStorage.setItem(name, value);
	}

	/**
	 * Saves or retrieves the problems.
	 * 
	 * @param	problems	The problems to save.
	 * @return					The saved problems.
	 */
	_.problems = (problems) => (
		problems
			? _.set('problems', JSON.stringify(problems))
			: JSON.parse(_.get('problems'))
	)

	/**
	 * Saves or retrieves the users.
	 * Sorts the array according to username.
	 * 
	 * @param	users			The users to save.
	 * @param	sort_by		What to use to sort the users.
	 * @return					The saved users.
	 */
	_.users = (users, sort_by='username') => (
		users
			? _.set('users', JSON.stringify(
				users.sort((a, b) => 
					a[sort_by].localeCompare(b[sort_by]))))
			: JSON.parse(_.get('users'))
	)

	/**
	 * Saves or retrieves the config.
	 * 
	 * @param	config		The config to save.
	 * @return					The saved config.
	 */
	_.config = (config) => (
		config
			? _.set('config', JSON.stringify(config))
			: JSON.parse(_.get('config'))
	)

	/**
	 * Returns details about the contest time.
	 * 
	 * @return	Information about the current time with respect to the contest timeline.
	 */
	_.time = () => {

		// Grab the contest details previously obtained from server
		const elims_start		= parseInt(_.get(ELIMS_START));
		const elims_end 		= parseInt(_.get(ELIMS_END));
		const finals_start 	= parseInt(_.get(FINALS_START));
		const finals_end 		= parseInt(_.get(FINALS_END));
		const now 					= parseInt(Date.now())

		// Determine relative time
		const relative = 
				now < elims_start		? 'before-elims' 	
			: now < elims_end 		? 'during-elims' 	
			: now < finals_start 	? 'before-finals'	
			: now < finals_end 		? 'during-finals'
			: 'ended';

		// Compute based on relative time
		switch(relative) {
	
			case 'before-elims': 
				return { suffix: 'until contest start', 	time: time(elims_start - now) }
	
			case 'during-elims': 
				return { suffix: 'until elims end', 			time: time(elims_end - now) }
	
			case 'before-finals':
				return { suffix: 'until finals start', 		time: time(finals_start - now) }
	
			case 'during-finals':
				return { suffix: 'until elims end', 			time: time(finals_end - now) }
	
			case 'ended': default: 
				return { suffix: 'since contest end',			time: time(now - finals_end) }
		}
	}

	return {
		..._,
	}

})();

/**
 * Encapsulated init.
 * 
 * // ! move this elsewhere??
 */
(() => {

X

	// Grab the config list
	.request('./user/configlist', 'POST')
	
	// Then update localStorage with the returned config
	.then((data) => (
		data['config'].forEach((parameter) => 
			PHO2.set(parameter.key, parameter.value))
	))

	// Catch any errors
	.catch((err) => (
		console.warn(err)
	));
	
})()
