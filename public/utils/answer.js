// Formats the answer into correct scientific notation
// Assumes a valid input string
// Valid input string must be checked via regex

const formatAnswer = (validAnswerString) => {
  let mantissa, exponent, isNegative = false;
  let answerValue = { mantissa, exponent };

  // If it's negative
  if(validAnswerString[0] == '-'){
    isNegative = true;
    validAnswerString = validAnswerString.slice(1, validAnswerString.length);
  }

  // If it's in sci notation
  if(validAnswerString.includes('e')){
    mantissa = validAnswerString.split('e')[0];
    exponent = parseInt(validAnswerString.split('e')[1]);
  } else {
    mantissa = validAnswerString;
    exponent = 0;
  }

  // If it's got a decimal or not
  if(mantissa.includes('.')){

    // Trim the zeros
    while(mantissa[0] == '0') mantissa = mantissa.slice(1, mantissa.length);
    while(mantissa[mantissa.length - 1] == '0') mantissa = mantissa.slice(0, mantissa.length - 1);
    if(mantissa == '.') mantissa = '0';
    if(mantissa[0] == '.') mantissa = '0' + mantissa;
  
    let shifts = mantissa.indexOf('.') - 1;
  
    // Oh sht it might've been 0!
    if(mantissa != '0'){

      // If it's not tho, convert to sci notation
      if(shifts > 0){
        temp = mantissa.replace('.', '');
        temp = temp[0] + '.' + temp.slice(1, temp.length);
  
        mantissa = temp;
        exponent += shifts;
      } else {
        if(mantissa[0] == '0'){
          temp = mantissa.split('.')[1];
          
          while(temp[0] == '0'){
            temp = temp.slice(1, temp.length);
            shifts--;
          } 
  
          shifts--;
          mantissa = temp.length > 1 ? temp[0] + '.' + temp.slice(1, temp.length) : temp;
          exponent += shifts;
        }
      }
    } else {
      mantissa = 0;
      exponent = 0;
    }
  } else {

    // Trim the zeros
    while(mantissa[0] == '0' && mantissa.length > 1) mantissa = mantissa.slice(1, mantissa.length);
  
    // Convert to sci notation
    if(mantissa.length > 1){
      exponent += mantissa.length - 1;
      mantissa = mantissa[0] + '.' + mantissa.slice(1, mantissa.length);
    }
  }

  answerValue.mantissa = parseFloat(mantissa) * (isNegative ? -1 : 1);
  answerValue.exponent = exponent;

  return answerValue;
}