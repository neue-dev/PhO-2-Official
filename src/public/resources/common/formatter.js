/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-01 08:58:03
 * @ Modified time: 2025-01-29 23:50:32
 * @ Description:
 * 
 * String formatters and what not.
 * Keeps all the regex in one place.
 * 
 * A strict prefixing of the methods is followed:
 * 
 * 	Formatter.valid_<smth>() 			Query whether or not a given string follows a format. These return promises (for ease of handling).
 * 	Formatter.format_<smth>() 		Convert objects (of a given shape) into valid strings that follow a format.
 * 	Formatter.lift_<smth>()				Create objects from a *valid* formatted string. 
 */

const Formatter = (() => {
	
	// Interface
	const _ = {};

	/**
	 * Checks if a string is in a valid answer format.
	 * Check the examples for a better idea of what formats are allowed.
	 * 
	 * Valid:			Invalid:
	 * 	4						4.
	 * 	1.60				.5
	 * 	-1.5e6			1e1.5
	 * 	25e-7				e1
	 * 	0.5					12.12.12
	 * 
	 * @param string	The string to check.
	 * @return	 			A promise for validity.
	 */	
	_.valid_submission_answer = (string) => (
		string.match(/^[-]?[0-9]+([.][0-9]+|[0-9]*)([e][-]?[0-9]+|[0-9]*)$/)
			? Promise.resolve(string)
			: Promise.reject('Answer does not follow format.')
	)
	
	/**
	 * Checks if a string is a valid problem code.
	 * Valid problem codes are a number followed by any set of alphabetical characters.
	 * Letters on their own are invalid problem codes, but lone numbers are valid.
	 * 
	 * Valid:		Invalid:
	 * 	4					a
	 * 	16a				g5
	 * 	1b				1b1
	 * 
	 * @param string	The string to check.
	 * @return	 			A promise for validity.
	 */
	_.valid_problem_code = (string) => (
		string.match(/^[0-9]+[a-zA-Z]*$/)
			? Promise.resolve(string)
			: Promise.reject('Problem code is not formatted correctly.')
	)

	/**
	 * Creates a valid problem code from the given code object.
	 * 
	 * @param o		The code object. 
	 * @return		A formatted problem code.
	 */
	_.format_problem_code = (o) => (
		o.number + o.alpha
	)

	/**
	 * Converts a submission answer object into a valid format.
	 * By default, it tries to adhere to scientific notation.
	 * Although because the mantissa might be outside (1, 10), it might not. 
	 * 
	 * @param o		The submission answer object. 
	 * @return		An answer formatted in scientific notation.
	 */
	_.format_submission_answer = (o) => (
		o.mantissa + 'e' + o.exponent
	)

	/**
	 * Creates a code object from a validly formatted code string.
	 * 
	 * @param	valid_string	A valid code string.
	 * @return 							An object containing information about the problem code.
	 */
	_.lift_problem_code = (valid_string) => (
		({
			number: valid_string.replace(/[a-zA-Z]*$/, ''),
			alpha: valid_string.replace(/^[0-9]*/, '')
		})
	)

	/**
	 * Creates an answer object from a validly formatted answer string.
	 * 
	 * @param	valid_string	A valid answer string.
	 * @return 							An object containing information about the answer.
	 */
	_.lift_submission_answer = (valid_string) => (
		
		// Grab mantissa and exponent
		((mantissa, exponent, sign) => (
				
			// Fix exponent, in case it wasn't explicitly defined
			exponent = exponent ? parseInt(exponent) : 0,
			exponent = isNaN(exponent) ? 0 : exponent,

			// Negative
			mantissa.startsWith('-') && (sign = -1, mantissa = mantissa.replace('-', '')),

			// Get rid of extra 0s
			mantissa = mantissa.replace(/^[0]*/, ''),
						
			// It was 0
			mantissa == '' 

					// Yes
					? (mantissa = '0', exponent = '0')
					
					// Check whether or not we're < 1 or > 1 
					: mantissa.startsWith('.')
						
						// < 1
						? mantissa.replaceAll('0', '') === '.'
							? (mantissa = '0', exponent = '0')
							: ((nonzeros) => (
									exponent += nonzeros.length - mantissa.length,
									mantissa = nonzeros.charAt(0) + '.' + nonzeros.slice(1)
								))(mantissa.replace('.', '').replace(/^[0]*/, ''))
						
						// > 1
						: ((index) => (
								index === -1
									? (exponent += mantissa.length - 1,
										mantissa = mantissa.charAt(0) + '.' + mantissa.slice(1))
									: (exponent += index - 1,
										mantissa = mantissa.charAt(0) + '.' + mantissa.replace('.', '').slice(1))
							))(mantissa.indexOf('.')),

						// Include sign
						sign < 0 && (mantissa = '-' + mantissa),
						mantissa.endsWith('.') && (mantissa = mantissa.replace('.', '')),

						// Convert two strings
						mantissa = mantissa + '',
						exponent = exponent + '',

			// Return it
			({ mantissa, exponent })
		))(
			valid_string.split('e')[0],
			valid_string.split('e')[1],
			1
		)
	) 

	return {
		..._,
	}

})();

