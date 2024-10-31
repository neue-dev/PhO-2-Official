/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-01 03:53:41
 * @ Modified time: 2024-11-01 05:48:25
 * @ Description:
 * 
 * Handles db related queries and what not.
 */

import mongoose from 'mongoose'

/**
 * Returns a thenable that gives the document we requested.
 * 
 * @param db	The db to query. 
 * @param id 	The id of the document OR a set of parameters to match.
 * @return		A promise for the document/s.
 */
export const select = async (db, id) => (
	typeof id !== 'object' 
		? await db.findOne({ _id: mongoose.Types.ObjectId(id) })
		: await db.findMany(id)
)

/**
 * Updates a database entry.
 * 
 * @param db 				The db to update.
 * @param id				The key to match. 
 * @param changes 	The changes to do.
 * @return					The modified document.
 */
export const update = async (db, id, changes) => (
	
	// Update based on changes
	(async (changes) => (
		typeof id !== 'object'
			? await db.updateOne({ _id: mongoose.Types.ObjectId(id) }, changes)
			: await db.updateMany(id, changes)
	
	// Filter props that are empty or null
	))(
		Object.keys(changes).reduce((acc, cur) => 
			cur != null && cur != undefined 
				? (acc[cur] = changes[cur], acc)  
				: (acc), 
			{}
		)
	)
)

/**
 * Deletes a particular document.
 * 
 * @param db	The db to query. 
 * @param id 	The id of the document OR a set of parameters to match.
 * @return		A promise for deletion of the documents.
 */
export const drop = async (db, id) => (
	typeof id !== 'object' 
		? await db.deleteOne({ _id: mongoose.Types.ObjectId(id) })
		: await db.deleteMany(id)
)

/**
 * Wraps a function around a null check 
 * 
 * @param	f				The function to wrap.
 * @param	error		The error to throw.
 * @return				The wrapped function.
 */
export const safe = (f, error) => (
	(...args) => (
		args.every(arg => arg !== null && arg !== undefined)
			? Promise.resolve(f(...args))
			: Promise.reject({ error })
	)
)

export default {
	select,
	update,
	drop,
	safe,
}
