export const validateName = (name: string): boolean => {
  const isValid:boolean = /^[a-zA-Z가-힣]*$/.test(name);
  return isValid;
};

export const validateUsername = (username: string): boolean => {
  const isValid:boolean = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/.test(username);
  return isValid;
};

export const validatePassword = (password: string): boolean => {
  const isValid:boolean = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,12}$/.test(password);
  return isValid;
};

export const validateEmail = (email: string): boolean => {
  const isValid:boolean = /^[^\s@]+@[^\s@]+\.[^\s@]{3,}$/.test(email);
  return isValid;
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const isValid:boolean = /^\d{3}-\d{4}-\d{4}$/.test(phoneNumber);
  return isValid;
};