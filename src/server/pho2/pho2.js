/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-03 09:45:00
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
	 * Retrieves the timestamp of the last submission of the user.
	 * Returns a promise for that value.
	 * 
	 * @param		user	User details.
	 * @return				A promise for the last_submit of the user.
	 */
	_.user_last_submission = (user) => (
		Aggregate(Submission)
			.filter('user_id', user._id)
			.filter('timestamp', Predicate().lt(Env.get_int('CONTEST_ELIMS_END')))
			.filter('timestamp', Predicate().ge(parseInt(Env.get_int('CONTEST_ELIMS_START'))))
			.group('user_id', [], Fields().field('timestamp').max('timestamp'))
	)

	return {
		..._,
	}

})();

export default {
	PHO2
}