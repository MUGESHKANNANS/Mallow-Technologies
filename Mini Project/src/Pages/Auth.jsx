import React from 'react';
import { Layout, Row, Col } from 'antd';
import { useLocation } from 'react-router-dom';
import SignIn from '../Components/auth/SignIn';
import SignUp from '../Components/auth/SignUp';
import authBg from '../assets/auth-bg.png';

const { Content } = Layout;

const Auth = () => {
  const location = useLocation();
  const isSignup = location.pathname === '/signup';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <Row style={{ minHeight: '100vh' }}>
          <Col
            xs={24}
            md={12}
            style={{
              background: '#ffffff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 20px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ width: '100%', maxWidth: 390 }}>
              {isSignup ? <SignUp /> : <SignIn />}
            </div>
          </Col>

          <Col
            xs={0}
            md={12}
            style={{
              backgroundImage: `url(${authBg})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </Row>
      </Content>
    </Layout>
  );
};

export default Auth;
