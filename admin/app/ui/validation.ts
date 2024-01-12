export const validateName = (name: string): boolean => {
<<<<<<< HEAD
  const isValid: boolean = /^[a-zA-Z가-힣]*$/.test(name);
=======
  // 값이 없을 경우에는 유효성 검사를 통과하지 않도록 합니다.
  if (!name) {
    return false;
  }
  // 수정된 문자열에 대해 유효성 검사를 수행합니다.
  const isValid: boolean = /^[a-zA-Z]*([가-힣]{1,2}[a-zA-Z]*)*$/.test(name);
>>>>>>> origin/work1
  return isValid;
};

export const validateUsername = (username: string): boolean => {
  const isValid: boolean = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/.test(
    username
  );
  return isValid;
};

export const validatePassword = (password: string): boolean => {
  const isValid: boolean =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,12}$/.test(
      password
    );
  return isValid;
};

export const validateAddress = (address: string): boolean => {
<<<<<<< HEAD
  const isValid: boolean = /^(?:[시도]+) (?:[구군]+) (?:[동읍면리]+)$/.test(
=======
  const isValid: boolean = /^(?:[가-힣]+시\s?(?:[가-힣]+구|군)\s?(?:[가-힣]+동|읍|면|리))$/.test(
>>>>>>> origin/work1
    address
  );
  return isValid;
};

export const validateEmail = (email: string): boolean => {
  const isValid: boolean = /^[^\s@]+@[^\s@]+\.[^\s@]{3,}$/.test(email);
  return isValid;
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const isValid: boolean = /^\d{3}-\d{4}-\d{4}$/.test(phoneNumber);
  return isValid;
};
