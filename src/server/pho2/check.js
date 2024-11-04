/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-03 08:31:52
 * @ Description:
 * 
 * The only thing I will not refactor...
 */

/**
 * Given an answer, a key, and a tolerance, determines whether or not the answer is correct (or wrong).
 * The computation is mathy and accounts for precision errors by not dealing with floats 
 * UNTIL after it "normalizes" the input into standard sci not.
 * 
 * Wait, actually it assumes the normalization of the answer and the key... because the client does
 * that automatically.... but it should do that here instead :""""")))
 * 
 * @param answer      The answer to check. 
 * @param key         The correct answer.
 * @param tolerance   The tolerance for the key.
 * @return            Correct or wrong.
 */
export const check_answer = (answer, key, tolerance) => {
  
  let user_mantissa = answer.mantissa;
  let user_exponent = answer.exponent;

  let key_mantissa = key.mantissa;
  let key_exponent = key.exponent;

  let ratio = user_mantissa / key_mantissa;
  let magnitude = Math.pow(10, user_exponent - key_exponent);

  // Why tf did I need to return strings...
  if (Math.abs(ratio * magnitude - 1) > tolerance + Math.pow(tolerance, 3))
    return 'wrong';
  return 'correct';
}

export default {
  check_answer
}