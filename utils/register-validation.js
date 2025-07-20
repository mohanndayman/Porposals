/**
 * Validates form fields with specific rules
 * @param {string} field - The name of the field to validate
 * @param {string} value - The value of the field
 * @param {object} formData - The entire form data object (for password confirmation)
 * @returns {string} - Error message or empty string if valid
 */
export const validateField = (field, value, formData = {}, t) => {
  // Ensure value is a string and remove undefined/null cases
  const processedValue = value ? String(value) : "";

  switch (field) {
    case "first_name":
      if (!processedValue.trim())
        return t ? t("validation.firstName.required") : "First name is required";
      if (processedValue.trim().length < 2)
        return t ? t("validation.firstName.minLength") : "First name must be at least 2 characters";
      if (!/^[a-zA-Z\s]*$/.test(processedValue))
        return t ? t("validation.firstName.onlyLetters") : "First name can only contain letters and spaces";
      return "";

    case "last_name":
      if (!processedValue.trim())
        return t ? t("validation.lastName.required") : "Last name is required";
      if (processedValue.trim().length < 2)
        return t ? t("validation.lastName.minLength") : "Last name must be at least 2 characters";
      if (!/^[a-zA-Z\s]*$/.test(processedValue))
        return t ? t("validation.lastName.onlyLetters") : "Last name can only contain letters and spaces";
      return "";

    case "email":
      if (!processedValue.trim()) 
        return t ? t("validation.email.required") : "Email is required";
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(processedValue))
        return t ? t("validation.email.invalid") : "Please enter a valid email address";
      return "";

    case "phone_number":
      if (!processedValue.trim()) 
        return t ? t("validation.phoneNumber.required") : "Phone number is required";
      const phoneRegex = /^00[1-9]\d{6,14}$/;
      if (!phoneRegex.test(processedValue.trim()))
        return t ? t("validation.phoneNumber.invalid") : "Please enter a valid phone number starting with your country code (e.g. 00962)";
      return "";

    case "password":
      if (!processedValue) 
        return t ? t("validation.password.required") : "Password is required";
      if (processedValue.length < 8)
        return t ? t("validation.password.minLength") : "Password must be at least 8 characters";
      if (!/[A-Z]/.test(processedValue))
        return t ? t("validation.password.uppercase") : "Password must contain at least one uppercase letter";
      if (!/[a-z]/.test(processedValue))
        return t ? t("validation.password.lowercase") : "Password must contain at least one lowercase letter";
      if (!/[0-9]/.test(processedValue))
        return t ? t("validation.password.number") : "Password must contain at least one number";
      return "";

    case "password_confirmation":
      if (!processedValue) 
        return t ? t("validation.passwordConfirmation.required") : "Please confirm your password";
      if (processedValue !== formData.password) 
        return t ? t("validation.passwordConfirmation.match") : "Passwords do not match";
      return "";

    case "gender":
      if (!processedValue) 
        return t ? t("validation.gender.required") : "Please select your gender";
      return "";

    default:
      return "";
  }
};

/**
 * Validates an entire form step
 * @param {number} stepNumber - The current step of the form
 * @param {object} formData - The current form data
 * @returns {object} - Validation results with errors and overall validity
 */
export const validateFormStep = (stepNumber, formData, t) => {
  const fieldsToValidate =
    stepNumber === 1
      ? ["first_name", "last_name", "email", "phone_number"]
      : ["gender", "password", "password_confirmation"];

  const newErrors = {};
  let isValid = true;

  fieldsToValidate.forEach((field) => {
    const error = validateField(field, formData[field], formData, t);
    newErrors[field] = error;
    if (error) isValid = false;
  });

  return {
    errors: newErrors,
    isValid,
  };
};
