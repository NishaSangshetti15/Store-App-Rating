// Validation utility functions

export const validateName = (name) => {
  if (!name || name.length < 20 || name.length > 60) {
    return "Name must be between 20 and 60 characters";
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 16) {
    return "Password must be between 8 and 16 characters";
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasUpperCase) {
    return "Password must include at least one uppercase letter";
  }
  
  if (!hasSpecialChar) {
    return "Password must include at least one special character";
  }
  
  return null;
};

export const validateAddress = (address) => {
  if (!address || address.length > 400) {
    return "Address must not exceed 400 characters";
  }
  return null;
};

export const validateRating = (rating) => {
  const ratingNum = parseInt(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return "Rating must be between 1 and 5";
  }
  return null;
};

export const validateSignupForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const addressError = validateAddress(formData.address);
  if (addressError) errors.address = addressError;
  
  return Object.keys(errors).length === 0 ? null : errors;
};

export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  if (!formData.password) {
    errors.password = "Password is required";
  }
  
  return Object.keys(errors).length === 0 ? null : errors;
};
