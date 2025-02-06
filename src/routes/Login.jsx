import { Button, Typography, message } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../AuthContext';

import { getUserByEmail } from '../api';
const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { googleSignIn } = UserAuth();

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result.user) {
        // Kiểm tra email trong mockapi
        const mockApiUser = await getUserByEmail(result.user.email);
        
        if (!mockApiUser) {
          message.error('Email không tồn tại trong hệ thống!');
          return;
        }

        localStorage.setItem('token', result.token);
        message.success('Login successfully!');
        navigate('/');
      }   
    } catch (error) {
      message.error('Login failed' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center space-y-2">
            <Title level={2} className="!text-slate-900 dark:!text-white !m-0">
              Welcome 
            </Title>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to continue to your account
            </p>
          </div>

          <div className="space-y-4">
            <Button
              type="default"
              icon={<GoogleOutlined />}
              size="large"
              block
              onClick={handleGoogleLogin}
              className="h-12 flex items-center justify-center bg-white hover:bg-slate-50 border-slate-200 
                dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600
                dark:text-white transition-colors"
            >
              <span className="ml-2">Continue with Google</span>
            </Button>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              block
              className="h-12 bg-blue-600 hover:bg-blue-700"
            >
              Sign in with Email
            </Button>
        <  */}

</div> 
        </div>
      </div>
    </div>
  );
};

export default Login;