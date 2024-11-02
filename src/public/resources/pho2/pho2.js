/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-28 06:26:15
 * @ Modified time: 2024-11-02 18:57:12
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
	 * Saves or retrieves the submissions.
	 * 
	 * @param	submissions		The submissions	to save.
	 * @return 							The saved submissions.
	 */
	_.submissions = (submissions) => DOM.store('submissions', submissions);

	/**
	 * Saves or retrieves the problems.
	 * 
	 * @param	problems	The problems to save.
	 * @return					The saved problems.
	 */
	_.problems = (problems) => DOM.store('problems', problems)

	/**
	 * Saves or retrieves the users.
	 * Sorts the array according to username.
	 * 
	 * @param	users			The users to save.
	 * @param	sort_by		What to use to sort the users.
	 * @return					The saved users.
	 */
	_.users = (users, sort_by='username') => DOM.store('users', users)

	/**
	 * Saves or retrieves the config.
	 * 
	 * @param	config		The config to save.
	 * @return					The saved config.
	 */
	_.config = (config) => DOM.store('config', config)

	/**
	 * Saves or retrieves the scores.
	 * 
	 * @param	config		The scores to save.
	 * @return					The saved scores.
	 */
	_.scores = (scores) => DOM.store('scores', scores)

	/**
	 * Saves user data.
	 * 
	 * @param user	The data to save. 
	 * @return			The data current stored by it.
	 */
	_.user = (user) => DOM.store('user', user)

	/**
	 * Returns details about the contest time.
	 * 
	 * @return	Information about the current time with respect to the contest timeline.
	 */
	_.time = () => {

		// Grab the contest details previously obtained from server
		const elims_start		= parseInt(DOM.store(ELIMS_START));
		const elims_end 		= parseInt(DOM.store(ELIMS_END));
		const finals_start 	= parseInt(DOM.store(FINALS_START));
		const finals_end 		= parseInt(DOM.store(FINALS_END));
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

	/**
	 * Logs out the user.
	 */
	_.logout = () => {
		X.request('./auth/logout', 'POST')
			.then(() => { location.href = '/' });
	}

	return {
		..._,
	}

})();

// Inits the timer and the local store
(() => {

  // Grab the config list
  X.request('./user/configlist', 'POST')
    
    // Then update localStorage with the returned config
    .then((data) => (
      data['config'].forEach((parameter) => 
        DOM.store(parameter.key, parameter.value))
    ))

    // Catch any errors
    .catch((err) => console.warn(err));
})()