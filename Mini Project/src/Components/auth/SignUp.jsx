import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';



const SignUp = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (location.state?.email || location.state?.password) {
      form.setFieldsValue({
        email: location.state.email,
        password: location.state.password,
      });
    }
  }, [location.state, form]);

  const inputStyle = {
    width: '100%',
    maxWidth: 390,
    height: 38,
    borderRadius: 6,
  };

  const onFinish = async (values) => {
    setLoading(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            password: values.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        message.error(result.message || 'Signup failed');
        setLoading(false);
        return;
      }

      const token = result.data.token;

      if (!token) {
        throw new Error("JWT token not found in signup response");
      }

      const user = {
        id: result.data.id,
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        email: result.data.email,
        img_url: result.data.img_url,
        is_active: result.data.is_active,
      };

      const expiry = Date.now() + 24 * 60 * 60 * 1000;

      localStorage.setItem(
        "auth",
        JSON.stringify({ user, token, expiry })
      );

      message.success('Account created & logged in successfully');

      navigate('/dashboard');
    } catch (error) {
      const msg = (error.message === "Failed to fetch")
        ? "You are offline. Please check your internet connection"
        : (error.message || 'Something went wrong. Please try again.');
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };


  const preventSpace = (e) => {
    if (e.key === ' ') e.preventDefault();
  };

  return (
    <div className="form-wrapper">
      <Typography.Title
        level={3}
        style={{ textAlign: 'center', marginBottom: 32 }}
      >
        Sign up for an account
      </Typography.Title>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="firstName"
              rules={[
                { required: true, message: 'First name is required' },
                { min: 2, message: 'Minimum 2 characters' },
                { max: 30, message: 'Maximum 30 characters' },
                { pattern: /^[A-Za-z ]+$/, message: 'Only letters allowed' },
              ]}
            >
              <Input
                placeholder="First Name"
                allowClear
                onKeyDown={preventSpace}
                disabled={loading}
                style={{
                  width: '100%',
                  height: 38,
                  borderRadius: 6,
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="lastName"
              rules={[
                { required: true, message: 'Last name is required' },
                { max: 30, message: 'Maximum 30 characters' },
                { pattern: /^[A-Za-z ]+$/, message: 'Only letters allowed' },
              ]}
            >
              <Input
                placeholder="Last Name"
                allowClear
                onKeyDown={preventSpace}
                disabled={loading}
                style={{
                  width: '100%',
                  height: 38,
                  borderRadius: 6,
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          rules={[
            { required: true },
            { type: 'email' },
            { max: 100 },
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
            { required: true },
            { min: 8, message: 'Minimum 8 characters' },
            { max: 32, message: 'Maximum 32 characters' },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
              message:
                'Password must include uppercase, lowercase, number & special character',
            },
          ]}
        >
          <Input.Password
            placeholder="Password"
            autoComplete="new-password"
            onKeyDown={preventSpace}
            style={inputStyle}
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true },
            { min: 8, message: 'Minimum 8 characters' },
            { max: 32, message: 'Maximum 32 characters' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value === getFieldValue('password')) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm Password"
            autoComplete="new-password"
            onPaste={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            style={inputStyle}
            disabled={loading}
          />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {() => {
            const password = form.getFieldValue('password');
            const confirmPassword = form.getFieldValue('confirmPassword');

            return password &&
              confirmPassword &&
              password === confirmPassword ? (
              <div
                style={{
                  color: '#52c41a',
                  marginTop: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <CheckCircleFilled />
                <span>Passwords match</span>
              </div>
            ) : null;
          }}
        </Form.Item>

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
                Sign up
              </Button>
            );
          }}
        </Form.Item>

        <Typography.Paragraph align="center">
          Already have an account?{' '}
          <span
            onClick={() => {
              navigate('/signin');
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
            Sign in
          </span>
        </Typography.Paragraph>
      </Form>
    </div>
  );
};

export default SignUp;
