import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, clearAuthError } from "../../store/authSlice";

const SignIn = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (location.state?.email || location.state?.password) {
      form.setFieldsValue({
        email: location.state.email,
        password: location.state.password,
      });
    }
  }, [location.state, form]);

  const { isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());

    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const inputStyle = {
    width: '100%',
    maxWidth: 490,
    height: 38,
    borderRadius: 6,
  };

  const onFinish = (values) => {
    setLoading(true);
    dispatch(loginRequest(values));
  };

  useEffect(() => {
    if (isAuthenticated) {
      message.success({
        content: 'Login successful',
        key: 'login-success',
        duration: 1,
      });

      setLoading(false);

      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    }
  }, [isAuthenticated, navigate]);


  useEffect(() => {
    if (error) {
      message.error(error);
      setLoading(false);
    }
  }, [error]);

  const preventSpace = (e) => {
    if (e.key === ' ') e.preventDefault();
  };

  return (
    <div className="form-wrapper">
      <Typography.Title
        level={3}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        Sign in to your account
      </Typography.Title>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input
            placeholder="Email"
            autoComplete="email"
            allowClear
            onKeyDown={preventSpace}
            style={inputStyle}
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'Minimum 6 characters' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
              message:
                'Password must include uppercase, lowercase, number & special character',
            },
          ]}
        >
          <Input.Password
            placeholder="Password"
            autoComplete="current-password"
            onKeyDown={preventSpace}
            style={inputStyle}
            disabled={loading}
          />
        </Form.Item>

        <div
          style={{
            width: '100%',
            maxWidth: 390,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <Checkbox>Save password</Checkbox>

          <span
            style={{
              color: '#1677ff',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Forgot Password?
          </span>
        </div>

        <Form.Item shouldUpdate>
          {() => {
            const isInvalid =
              !form.isFieldsTouched(true) ||
              form.getFieldsError().some(({ errors }) => errors.length);

            return (
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading || isInvalid}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  width: '100%',
                  maxWidth: 390,
                  height: 38,
                  borderRadius: 6,
                  backgroundColor: (!loading && !isInvalid && hover) ? '#0958d9' : '#1677ff',
                  borderColor: (!loading && !isInvalid && hover) ? '#0958d9' : '#1677ff',
                  color: '#ffffff',
                  cursor: isInvalid || loading ? 'not-allowed' : 'pointer',
                }}
              >
                Sign in
              </Button>
            );
          }}
        </Form.Item>

        <Typography.Paragraph align="center">
          Don’t have an Account?{' '}
          <span
            onClick={() => {
              navigate('/signup');
            }}
            style={{
              fontWeight: 600,
              cursor: 'pointer',
              color: '#1677ff',
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            Sign up
          </span>
        </Typography.Paragraph>
      </Form>
    </div>
  );
};

export default SignIn;
