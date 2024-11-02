/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-01 03:53:41
 * @ Modified time: 2024-11-02 14:07:25
 * @ Description:
 * 
 * Handles db related queries and what not.
 */

import * as R from 'ramda'
import mongoose, { mongo } from 'mongoose'

/**
 * A helper function that converts strings into valid object ids.
 * 
 * @param id	A possible id. 
 * @return		A definite mongoose object id.
 */
const cast_id = (id) => typeof id === 'object' ? id : new mongoose.Types.ObjectId(id)

/**
 * Similar to the helper above, except it casts based on the field name.
 * 
 * @param field		The name of the field. 
 * @param id 			The value to cast.
 * @return				A casted id if it were.
 */
const cast_if_id = (field, id) => 
	typeof field === 'string' 
		? field.includes('_id') ? cast_id(id) : id
		: id;

/**
 * This is a helper function.
 * Flattens an object so that nested objects become expressed as absolute keys.
 * Don't mind the _en, it's only an internal function and not the actual parameter.
 * 
 * @param	obj		The object to flatten.
 * @return			A flattened version of the object
 */
const flatten = ((_en) => (

	// This is an internal helper function
	_en = (obj) => (
		((out) => (
			out = [],
			Object.keys(obj).map(key => 
				typeof obj[key] !== 'object' || Array.isArray(obj[key])
					? out.push({ key, value: obj[key] })
					: out = out
						.concat(_en(obj[key])
						.map((sobj) => ({ key: `${key}.${sobj.key}`, value: sobj.value })))
			),
			out
		))()
	),

	// The actual flatten function
	(obj) => _en(obj).reduce((acc, prop) => (acc[prop.key] = prop.value, acc), {})
))()

/**
 * A predicate builder that makes it easier to deal with mongodb.
 *  
 * @return	A new predicate with the conditions we specified. 
 */
export const Predicate = () => (
		
	// Give it methods
	((predicate) => (

		Object.setPrototypeOf(predicate, {

			// Not equal to
			ne: (...values) => (
				values.length <= 1
					? predicate.$ne = values[0] === undefined ? null : values[0]
					: predicate.$nin = values,
				predicate
			),

			// Equal to
			eq: (...values) => (
				values.length <= 1
					? predicate.$eq = values[0] === undefined ? null : values[0]
					: predicate.$in = values,
				predicate
			)
		})

	// The predicate we want to modify	
	))({})
)

/**
 * Creates a decorated query object with our custom helper methods.
 * 
 * @param Model		The model to query. 
 * @return				The decorated query object.
 */
export const Query = (Model) => (
	
	// Extend the query
	((query, query_promise, query_resolve, query_reject, query_id=null, query_queue=[]) => (

		// Create a promise for the resolution of the query
		query_promise = new Promise((resolve, reject) => 
			(query_resolve = resolve, query_reject = reject)),

		Object.assign(query, {

			// Assign an id to the query
			id: (id) => (
				query_id = cast_id(id),
				query
			),

			// Selects based on match, if field is null, all are selected
			// An object with filters may be passed in, or a single field name with associated permitted values
			select: (field, ...values) => (

				// If it's an array, we do an or
				Array.isArray(field)
					? query.or(field.map(f => flatten(f)))
					: field 

						// If it's an object
						? typeof field === 'object'
							? query.find(flatten(field))

							// It's not an object, we're enumerating values
							: values.length <= 1
								? values[0] === undefined 
									? query.where(field).equals(null) 
									: query.where(field).equals(cast_if_id(field, values[0])) 
								: query.where(field).in(values)
						: query_id 
							? query.where('_id').equals(query_id)
							: null,
				query
			),

			// Creates a separate insert statement
			insert: (...values) => (
				query_queue.push(() => Model.insertMany(values)),
				query
			),

			delete: () => (
				query_id
					? query_queue.push(() => Model.deleteOne({ _id: query_id }))
					: console.error('ID has not been set.'),
				query
			),

			// Creates a separate update statement
			update: (value) => (
				query_id 
					?	query_queue.push(() => Model.updateOne({ _id: query_id }, value))
					: console.error('ID has not been set.'),
				query
			),

			// Runs the actual query
			run: () => (
				(query_queue.length 
					? Promise.all([ query.exec(), ...query_queue.map(query => query()) ])
					: query.exec()
				).then(results => query_resolve(results)),
				query
			),

			// Checks if result is empty, and executes callback if true
			result_is_empty: (f) => (
				query_promise.then(results => (results.length ? null : f(), results)), 
				query
			),

			// Checks if result is not empty, and executes callback with results
			result_is_not_empty: (f) => (
				query_promise.then(results => (results.length ? f(results) : null, results)), 
				query
			),

			// Chains a then to the query_promise
			then: (f) => (
				query_promise.then(results => f(results)), 
				query
			),

			// Chains a catch to the query_promise
			catch: (f) => (
				query_promise.catch(error => f(error)),
				query
			)
		})

	// Create the query here
	))(Model.find({})) 
)

/**
 * Factory class for creating commonly-used queries.
 */
export const QueryFactory = (() => {

	// Interface
	const _ = {}

	/**
	 * Updates an entry with the given changes if it exists in the database.
	 * 
	 * @param Model				The model to use.	 
	 * @param id 					The id of the entry.
	 * @param	updates			The updates to push.
	 * @param	on_success	On success callback.
	 * @param	on_failure	On failure callback.
	 */
	_.update_if_exists = R.curry((Model, id, updates, on_success, on_failure) => (
		Query(Model).id(id)
			.select()
			.result_is_empty(on_failure)
			.result_is_not_empty(() => 
				Query(Model).id(id)
					.update(updates)
					.then(on_success)
					.run()
				)
	));

	/**
	 * Deletes an entry if it exists in the database.
	 * 
	 * @param Model				The model to use.	 
	 * @param id 					The id of the entry.
	 * @param	on_success	On success callback.
	 * @param	on_failure	On failure callback.
	 */
	_.delete_if_exists = R.curry((Model, id, on_success, on_failure) => (
		Query(Model).id(id)
			.select()
			.result_is_empty(on_failure)
			.result_is_not_empty(() => 
				Query(Model).id(id)
					.delete()
					.then(on_success)
					.run()
				)
	));

	/**
	 * Inserts a document if no documents match the filters.
	 * 
	 * @param Model				The model to use.	 
	 * @param	filters			The filters to use.
	 * @param models 			The models to insert.
	 * @param	on_success	On success callback.
	 * @param	on_failure	On failure callback.
	 */
	_.insert_if_unique = R.curry((Model, filters, models, on_success, on_failure) => (
		Query(Model).select(filters)
      .result_is_empty(() => 
				Query(Model)
				.insert(models)
				.then(on_success)
				.run())
      .result_is_not_empty(on_failure)
	));

	return {
		..._,
	}

})();

/**
 * Util func for mapping retains.
 * 
 * @param retains		An array of fields to keep. 
 * @return					Object containing $first => retain.
 */
const map_retains = (retains) => retains.reduce((acc, retain) => (acc[retain] = { $first: `$${retain}` }, acc), {})

/**
 * Maps nested fields into the fields we're after.
 * 
 * @param nests				An array of fields to translate.
 * @param	collection	The collection they're from.
 * @return						Object containing mappings of fields from their old collection.
 */
const map_nests = (nests, collection, prefix) => nests.reduce((acc, nested) => (acc[`${prefix}_${nested}`] = { $first: `$${collection}.${nested}` }, acc), {})

/**
 * Concats multi-type fields into one string.
 * 
 * @param fields	The fields to concat. 
 * @return				A command for concatenating those fields.
 */
const concat_fields = (fields) => ({ $concat: fields.map((field) => ({ $toString: `$${field}` })) })

/**
 * Maps fields from 'field' to '$field'.
 * Also inverts the mapping, so the function call (Aggregate.rename()) feels more intuitive.
 * 
 * @param fields	The fields ot map. 
 * @return				The object with the mapped fields.
 */
const rename_fields = (fields) => Object.keys(fields).reduce((acc, field) => (acc[fields[field]] = `$${field}`, acc), {})

/**
 * Extension of the mongoose aggregate class.
 * 
 * @param Model		The model to create the aggregate for. 
 * @return				The decorated aggregate.
 */
export const Aggregate = (Model) => (

	((aggregate, aggregate_promise, aggregate_resolve, aggregate_reject) => (

		// Alias the old methods
		aggregate._group = aggregate.group,
		aggregate._project = aggregate.project,

		// Create a promise for the resolution of the query
		aggregate_promise = new Promise((resolve, reject) => 
			(aggregate_resolve = resolve, aggregate_reject = reject)),

		Object.assign(aggregate, {

			// Filters the values of the ROWS
			filter: (field, value) => (
				aggregate.match({ [field]: cast_if_id(field, value) }),
				aggregate
			),

			// Groups documents by the given key, specifies new keys to generate
			group: (field, retains=[], aggregates={}) => (
				field === null 
					? aggregate._group({ _id: null, ...map_retains(retains), ...aggregates })
					: Array.isArray(field)
						? (aggregate.addFields({ __g: concat_fields(field) }),
							aggregate._group({ _id: '$__g', ...map_retains(retains), ...aggregates }),
							aggregate.project({ __g: false }))
						: aggregate._group({ _id: `$${field}`, ...map_retains(retains), ...aggregates }),
				aggregate
			),

			// I regret not doing this in SQL now...
			join: (Model, local_id, foreign_id, prefix, fields) => (
				aggregate.lookup({ from: Model.collection.name, localField: local_id, foreignField: foreign_id, as: '_' + Model.collection.name }),
				aggregate.addFields({ ...map_nests(fields, '_' + Model.collection.name, prefix) }),
				aggregate.project({ ['_' + Model.collection.name]: false }),
				aggregate
			),
			
			// Specifies the shape of the output
			rename: (mapping) => (
				aggregate._project(rename_fields(mapping)),
				aggregate
			),

			// Executes the query
			run: () => (
				aggregate.exec().then(results => aggregate_resolve(results)),
				aggregate
			),

			// Chains a then to the query_promise
			then: (f) => (
				aggregate_promise.then(results => f(results)), 
				aggregate
			),

			// Chains a catch to the query_promise
			catch: (f) => (
				aggregate_promise.catch(error => f(error)),
				aggregate
			)
		})
	))(Model.aggregate())
)

/**
 * Creates a bunch of new fields, usually for aggregates.
 * 
 * @return	A bunch fields with operators in them. 
 */
export const Fields = () => (

	// The set of fields and the one we're currently modifying
	((fields, field, operator_factory) => (

		// Give it methods
		Object.setPrototypeOf(fields, {

			// Creates a new field
			field: (name) => (
				field = fields[name] = {},
				fields
			),

			// Sums the values of the specified props
			sum: (...args) => (field = operator_factory('$sum', field, fields)(...args), fields),
			
			// Grab min of specified values
			min: (...args) => (field = operator_factory('$min', field, fields)(...args), fields),

			// Grab max of values
			max: (...args) => (field = operator_factory('$max', field, fields)(...args), fields)
		})

	// Create the object, and default init with null
	))(
		{}, null, 

		// Default operator factory
		(operator, field, fields) => ((...values) => (
			field 
				? values.length <= 1
					? field[operator] = values[0] === undefined ? null : typeof values[0] === 'string' ? `$${values[0]}` : values[0] 
					: field[operator] = values.map(value => typeof value === 'string' ? `$${value}` : value)
				: null,
			field 
		))
	)
)

// ! asdasdajsdgagsdgasd
// ! old

/**
 * Creates a new entry in the database.
 * 
 * @param model		The model to instantiate. 
 * @param	db			The collection to modify.
 * @param	params	The params for creating the document.
 * @return				The created document.
 */
export const create = async (model, db, params) => (
	await (new model({
		_id: new mongoose.Types.ObjectId(),
		...params,
	}, { collection: db })).save()
)

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
		: await db.find(id)
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
	Predicate,
	Query,
	Aggregate,
	Fields,
}
