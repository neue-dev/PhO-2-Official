/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-04 12:17:41
 * @ Description:
 * 
 * Handles time representations and what not.
 */

const Time = (() => {
	
	// Interface
	const _ = {};

	/**
	 * A helper function for representing numbers with two digits regardless.
	 * 
	 * @param	number	The number to represent.
	 * @param	mod			The number to use for modding.
	 */
	const two_digit_int = (number, mod) => (
		number = Math.floor(number),
		number %= mod,
		`${number < 10 ? '0' + number : number}`	
	)

	/**
	 * Display the basic singular or plural form of the word, based on value.
	 * 
	 * @param value		The reference value. 
	 * @param string	The string to pluralize.
	 * @return				The singular or plural form.
	 */
	const pluralize = (value, string) => (
		value === 1 
			? string
			: string + 's'
	)

	/**
	 * Displays time intervals ago.
	 * 
	 * @param value 	The value of the interval.
	 * @param unit		The unit of time, as a string. 
	 * @return 				The message.
	 */
	const ago = (value, unit) => (
		value + ' ' + pluralize(value, unit) + ' ago'
	)

	/**
	 * Returns the current timestamp.
	 * 
	 * @return	The current timestamp. 
	 */
	_.now = () => new Date().getTime()

	/**
	 * Converts milliseconds into minutes and seconds.
	 * 
	 * @param	millis	The number of milliseconds to convert.
	 * @return				A string formatting the milliseconds in mm:ss.
	 */
	_.millis_to_ms = (millis) => (
		millis /= 1000,
		`${Math.floor(millis / 60)}:${two_digit_int(millis, 60)}`
	)

	/**
	 * Converts a timestamp into mmm:dd:yyyy and hh:mm:ss.
	 * 
	 * @param timestamp		The timestamp to convert. 
	 * @return						A formatted string as described above.
	 */
	_.timestamp_to_mdy_hms = (timestamp) => (
		((date) => (
			`${date.toString().substring(4, 24)}`
		))(new Date(timestamp * 1))
	)

	/**
	 * Creates a unix timestamp from an arbitrary (hopefully valid) date string.
	 * 
	 * @param datestr		The date string. 
	 * @return					The timestamp.
	 */
	_.timestamp_from_datestr = (datestr) => (
		new Date(datestr).getTime()
	)

	/**
	 * Nifty function for expressing intervals.
	 * Adopted from https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
	 * 
	 * @param interval	The interval (in millis). 
	 * @return					 
	 */
	_.interval_to_since = (interval) => (

		// Number of seconds since
		((seconds) => (
			
			// Display right interval
			interval = seconds / 31536000,
			interval > 1 ? ago(Math.floor(interval), 'year')
				: (interval = seconds / 2592000, interval > 1 ? ago(Math.floor(interval), 'month') 
				: (interval = seconds / 86400, interval > 1 ? ago(Math.floor(interval), 'day')
				: (interval = seconds / 3600, interval > 1 ? ago(Math.floor(interval), 'hour')
				: (interval = seconds / 60, interval > 1 ? ago(Math.floor(interval), 'minute') 
				: ('a few seconds ago')))))
		
		// Convert to seconds
		))(interval / 1000)
	)

	return {
		..._
	}

})();
