export const validateName = (name) => {
  const isValid = /^[a-zA-Z가-힣]*$/.test(name);
  return isValid;
};

export const validateUsername = (username) => {
  const isValid = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/.test(username);
  return isValid;
};

export const validatePassword = (password) => {
  const isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,12}$/.test(password);
  return isValid;
};

export const validateEmail = (email) => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{3,}$/.test(email);
  return isValid;
};

export const validatePhoneNumber = (phoneNumber) => {
  const isValid = /^\d{3}-\d{4}-\d{4}$/.test(phoneNumber);
  return isValid;
};