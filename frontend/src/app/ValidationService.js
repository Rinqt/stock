/**
 * a helper class used for user input validation
 */
class Validator {
  /**
   * method used to validate that user enters correct email example@domain.com
   * @param email String email
   */
  emailValidator(email) {
    const regex = RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    return regex.test(email);
  }

  /**
   * method used to validate that user enters correct username
   * @param username String user name
   */
  usernameValidator(username) {
    const regex = RegExp(/^[a-zA-Z0-9-_]{5,15}$/g);

    return regex.test(username);
  }

  /**
   * method used to validate that user enters correct password
   * @param username String password
   */
  passwordValidator(password) {
    const capital = RegExp(/[A-Z]/);
    const small = RegExp(/[a-z]/);
    const numbers = RegExp(/[0-9]/);

    return (
      capital.test(password) &&
      small.test(password) &&
      numbers.test(password) &&
      password.length > 7
    );
  }

  /**
   * method used to validate that 2 strings are the same
   * @param s1 String first input
   * @param s2 String first input
   */
  stringMatchValidator(s1, s2) {
    return s1 === s2;
  }

  /**
   * method used to validate that user enters correct code
   * @param code String code
   */
  confirmationCodeValidator(code) {
    return code.length === 6;
  }
}

export default Validator;
