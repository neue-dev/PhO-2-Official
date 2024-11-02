/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-01 03:33:05
 * @ Modified time: 2024-11-02 16:33:34
 * @ Description:
 * 
 * Handles server IO responsibilities.
 */

import fs from 'fs';
import mustache from 'mustache';
import path from 'path'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Utils
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(path.join(__filename, '..'));

// Constants
export const SERVER_PUBLIC_URL = __dirname + '/public/resources'
export const SERVER_HOME_URL = '/public/home.html'


// ! todo update these too
/**
 * Sends a file to the client.
 * Default root is set.
 * 
 * @param res   The response api. 
 * @param file  The file to send. 
 */
export const send_file = (res, file=SERVER_HOME_URL) => res.sendFile(file, { root: __dirname })

/**
 * Reads a file, promisified.
 * 
 * @param file  The file to read. 
 * @return      A promise for the data.
 */
export const read_file = (file) => Promise.resolve(fs.readFileSync(file, 'utf-8'))

/**
 * Writes a file to the output stream.
 * Replaces mustache templates with the given options too.
 * 
 * @param res         The response api. 
 * @param file        The file to write.
 * @param mustaches   The stuff to replace.  
 */
export const write_file = (res, file, mustaches) => 
  read_file(file)
    .then(data => res.write(mustache.render(data, mustaches)))

/**
 * Redirects the client to the given path.
 * 
 * @param res   The response api. 
 * @param path  The path to go to.
 */
export const redirect = (res, path) => res.redirect(path)

// ! update everything above this line


/**
 * Creates a function that gets the contents of the request body.
 * The resulting function returns the request body without the checks.
 * 
 * @param req		The request interface to use. 
 * @return			A function for getting the body of the request.
 */
const get = (req) => 
	(prefix='') => (Object.keys(req.body).reduce((acc, key) => (acc[key.replace(prefix, '')] = req.body[key], acc), {}))

/**
 * Creates a failure function. // !
 * 
 * ? make this so it logs the error elsewhere
 * 
 * @param res				The response api. 
 * @return 					A function that creates a fail response.
 */
const failure = (res) => 
	({ status = 500, error = 'Something went wrong.' } = {}) => 
		() => (res.status(status).json({ error }), console.error(error))

/**
 * Creates a success function. // !
 * 
 * ? make this so it logs the notif elswhere too
 * 
 * @param res		The response api. 
 * @returns			A function that creates a success response.
 */
const success = (res) => 
	({ message = '' } = {}) => 
		() => (res.status(200).json({ message }), console.log(message))

/**
 * A decorator that gives us access to utils.
 * 
 * @param {*} f 
 * @returns 
 */
export const io = (f) => 
	(req, res, ...args) => 
		(req.get = get(req), res.success = success(res), res.failure = failure(res), f(req, res, ...args))


	
// ! remove
export const fail = (() => null)
export const succeed = (() => null)

export default {
	send_file,
	read_file,
	write_file,
	redirect,
	io,

	SERVER_PUBLIC_URL,
	SERVER_HOME_URL,
}