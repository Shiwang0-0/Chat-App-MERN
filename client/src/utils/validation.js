export const validate= (values,isLogin) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Username is required!";
    }
    else if (values.username.length < 2) {
      errors.username = "username must be more than 2 characters";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be more than 6 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    if(!isLogin && values.confirmpassword !== values.password){
        errors.confirmpassword = "Please type the same password as entered above";
    }
    return errors;
  };
