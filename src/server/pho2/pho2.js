/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-03 11:15:58
 * @ Description:
 * 
 * Stores a number of queries relevant only to the domain.
 */

import { Aggregate, Fields, Predicate, Query } from '../core/db.js'

import { Problem } from '../models/problem.js';
import { Submission } from '../models/submission.js';
import { User } from '../models/user.js';

import { Env } from '../core/env.js';

export const PHO2 = (() => {
	
	const _ = {};

	/**
	 * Makes it easier to deal with promises.
	 * 
	 * @return	Promise, resolve(), reject(). 
	 */
	const create_promise = () => {
		
		// Resolver and rejecter
		let promise_resolve = null;
		let promise_reject = null;

		// The promise
		let promise = new Promise((resolve, reject) => {
			promise_resolve = resolve;
			promise_reject = reject;
		})

		// Return an array to be destructured
		return [ promise, promise_resolve, promise_reject ];
	}

	/**
	 * Encapsulates in our functions in a 'promise'.
	 * 
	 * @param f	The function to wrap.	 
	 * @return	A promisified function.
	 */
	const promisify = (f) => 
		(...args) =>
			f(create_promise(), ...args)

	/**
	 * Retrieves the timestamp of the last submission of the user.
	 * Returns a promise for that value.
	 * 
	 * @param		user	User details.
	 * @return				A promise for the last_submit of the user.
	 */
	_.user_last_submit = promisify(([ promise, resolve, reject ], user) => (
		Aggregate(Submission)
			.filter('user_id', user._id)
			.filter('timestamp', Predicate().lt(Env.get_int('CONTEST_ELIMS_END')))
			.filter('timestamp', Predicate().ge(parseInt(Env.get_int('CONTEST_ELIMS_START'))))
			.group('user_id', [], Fields().field('timestamp').max('timestamp'))
			.then((submissions) => resolve(submissions.length ? submissions[0].timestamp : 0))
			.run(),
		promise
	))

	return {
		..._,
	}

})();

export default {
	PHO2
}