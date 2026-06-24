import { Alert, Button, ConfigProvider, Form, Input } from 'antd';
import { Activity, Lock, Moon, Sun, User } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import {
  clearError,
  loginFailure,
  loginSuccess,
  toggleTheme,
  useAppDispatch,
  useAppSelector,
} from '@/app/providers/store';
import { getAntdThemeConfig } from '@/app/styles/themeConfig';
import { useLoginMutation } from '@/shared/api';
import type { LoginRequest } from '@/shared/libs';
import styles from './LoginPage.module.scss';

export const LoginPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.auth.error);
  const theme = useAppSelector((state) => state.ui.theme);
  const [login] = useLoginMutation();

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    dispatch(clearError());
    try {
      const response = await login(values).unwrap();
      dispatch(loginSuccess(response.token ?? 'demo-token'));
    } catch (err) {
      const errorData = err as { data?: { message?: string }; message?: string };
      const errMsg = errorData?.data?.message || errorData?.message || 'Сетевая ошибка';
      dispatch(loginFailure(errMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={getAntdThemeConfig(theme)}>
      <div className={styles.loginContainer}>
        {/* Background blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />

        {/* Theme Toggle */}
        <div className={styles.themeToggle}>
          <Button
            type="text"
            shape="circle"
            data-testid="theme-toggle-btn"
            icon={
              theme === 'dark' ? (
                <Sun size={18} className={styles.toggleIcon} />
              ) : (
                <Moon size={18} className={styles.toggleIcon} />
              )
            }
            onClick={() => dispatch(toggleTheme())}
            className={styles.themeBtn}
          />
        </div>

        {/* Login Card */}
        <div className={`${styles.loginCard} glass-panel`}>
          <div className={styles.cardHeader}>
            <div className={styles.logoWrapper}>
              <Activity className={styles.logoIcon} size={32} />
            </div>
            <h1 className={styles.title}>NTV</h1>
            <p className={styles.subtitle}>Network Topology Viewer</p>
          </div>

          {error && (
            <Alert
              title={error}
              type="error"
              showIcon
              className={styles.alert}
              closable
              onClose={() => dispatch(clearError())}
            />
          )}

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            autoComplete="off"
            className={styles.form}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя' }]}
            >
              <Input
                prefix={<User size={16} className={styles.inputIcon} />}
                placeholder="Имя пользователя"
                size="large"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}
            >
              <Input.Password
                prefix={<Lock size={16} className={styles.inputIcon} />}
                placeholder="Пароль"
                size="large"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                className={styles.submitBtn}
              >
                Войти
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.credentialsTip}>
            <span>
              Демо-доступ: <strong>admin</strong> / <strong>admin</strong>
            </span>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LoginPage;
