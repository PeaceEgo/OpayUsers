const yup = require('yup');

const userSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  mobileNumber: yup
    .string()
    .required('Mobile number is required')
    .matches(
      /^(?:\+234|234|0)([7-9][0-1]\d{8}|\d{10})$/,
      'Mobile number must start with +234, 234, or 0 and have the correct length'
    ),
  nickName: yup.string().optional(),
  gender: yup.string().oneOf(['Male', 'Female', 'Other']).required(),
  dateOfBirth: yup.string().required('Date of birth is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .matches(/\.com$/, 'Email must end with .com')
    .required('Email is required'),
});

module.exports = userSchema;
