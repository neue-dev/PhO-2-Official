/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-02 18:13:26
 * @ Description:
 * 
 * Stores a number of queries relevant only to the domain.
 */

import 'dotenv/config'

import { Aggregate, Fields, Predicate, Query } from './db.js'

import { Problem } from './models/problem.js';
import { Submission } from './models/submission.js';
import { User } from './models/user.js';

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
			.filter('timestamp', Predicate().lt(parseInt(process.env.CONTEST_ELIMS_END.toString())))
			.filter('timestamp', Predicate().ge(parseInt(process.env.CONTEST_ELIMS_START.toString())))
			.group('user_id', [], Fields().field('timestamp').max('timestamp'))
	)

	return {
		..._,
	}

})();

export default {
	PHO2
}