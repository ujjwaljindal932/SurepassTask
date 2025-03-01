import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login, setError } from '../../redux/slices/authSlice';
import './Login.css';


const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});


const Login = () => {
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      dispatch(login({ email: values.email }));
      setSubmitting(false);
    }, 500);
  };


  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-left">
            <div className="login-header">
              <i className="bi bi-receipt-cutoff logo-icon"></i>
              <h1>Invoice Management System</h1>
              <p>Welcome back! Please login to your account.</p>
            </div>


            {error && (
              <div className="alert-error">
                <i className="bi bi-exclamation-circle"></i>
                {error}
              </div>
            )}


            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form>
                  <div className="form-group">
                    <label htmlFor="email">
                      <i className="bi bi-envelope"></i>
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="error-message" />
                  </div>


                  <div className="form-group">
                    <label htmlFor="password">
                      <i className="bi bi-lock"></i>
                      Password
                    </label>
                    <div className="password-input">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="error-message" />
                  </div>


                  <button
                    type="submit"
                    className="login-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="bi bi-arrow-clockwise spinning"></i>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right"></i>
                        Login
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
          
          <div className="login-right">
            <div className="feature-list">
              <h2>Features</h2>
              <ul>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  Easy Invoice Generation
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  Customer Management
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  Payment Tracking
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  Detailed Reports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Login;




