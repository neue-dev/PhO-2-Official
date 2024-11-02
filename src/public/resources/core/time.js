/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-02 19:19:31
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

	return {
		..._
	}

})();
