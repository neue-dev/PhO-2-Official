/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-01 03:33:05
 * @ Modified time: 2024-11-01 08:52:48
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

/**
 * Fails the current request.
 * 
 * @param res				The response api. 
 * @param status 		The status to set.
 * @param error 		The error to throw.
 */
export const fail = (res, { status = 400, error = '' } = {}) => 
	res.status(status).json({ error })

/**
 * Succeeds the current request.
 * 
 * @param res				The response api. 
 * @param status 		The status to set.
 * @param error 		The message to send.
 */
export const succeed = (res, { message = '' } = {}) => 
	res.status(200).json({ message })

export default {
	send_file,
	read_file,
	write_file,
	redirect,
	fail,
	succeed,

	SERVER_PUBLIC_URL,
	SERVER_HOME_URL,
}