/**
 * @ Author: Mo David
 * @ Create Time: 1970-01-01 08:00:00
 * @ Modified time: 2024-11-02 15:55:49
 * @ Description:
 * 
 * The only thing I will not refactor...
 */

// Checks answer
export const check_answer = (answer, key, tolerance) => {
  let user_mantissa = answer.mantissa;
  let user_exponent = answer.exponent;

  let key_mantissa = key.mantissa;
  let key_exponent = key.exponent;

  let ratio = user_mantissa / key_mantissa;
  let magnitude = Math.pow(10, user_exponent - key_exponent);
  let discriminant = Math.abs(ratio * magnitude - 1);

  if (Math.abs(ratio * magnitude - 1) > tolerance + Math.pow(tolerance, 3))
    return false;
  return true;
}

export default {
  check_answer
}