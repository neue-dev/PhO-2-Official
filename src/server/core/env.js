/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-03 09:49:00
 * @ Description:
 * 
 * Handles environment variable management.
 * 
 * This exists as a proxy in case we want to log these changes or smth.
 */

import 'dotenv/config'
import { get } from 'mongoose';

export const Env = (() => {
	
	// Interface
	const _ = {};

	// Returns the request variable
	_.get = (variable) => process.env[variable];

	// Retrieves a variable as an int
	_.get_int = (variable) => parseInt(_.get(variable).toString())

	/**
	 * A fluent setter for environment vars.
	 * Logs the changes.
	 * 
	 * @param variable	The variable to set. 
	 * @param value			New value. 
	 * @return					The env interface.
	 */
	_.set = (variable, value) => (
		process.env[variable] = value,
		console.log(`Updated ENV: set ${variable} = ${value}.`),
		_
	)

	return {
		..._,
	}

})();

export default {
	Env
}

