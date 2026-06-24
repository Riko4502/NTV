import { LockOutlined, StopOutlined, WarningOutlined } from '@ant-design/icons';

export const ERROR_CONFIGS = {
  403: {
    title: 'Доступ ограничен',
    description:
      'У вас нет прав для просмотра этой страницы. Пожалуйста, обратитесь к администратору системы.',
    icon: LockOutlined,
    colorScheme: 'warning',
    glowBorder: 'rgba(245, 158, 11, 0.2)',
    glowShadow: 'rgba(245, 158, 11, 0.15)',
  },
  404: {
    title: 'Страница не найдена',
    description: 'Запрошенная страница не существует или была перемещена по новому адресу.',
    icon: StopOutlined,
    colorScheme: 'primary',
    glowBorder: 'rgba(59, 130, 246, 0.2)',
    glowShadow: 'rgba(59, 130, 246, 0.15)',
  },
  500: {
    title: 'Ошибка приложения',
    description:
      'В приложении произошел непредвиденный сбой. Мы уже работаем над решением этой проблемы.',
    icon: WarningOutlined,
    colorScheme: 'error',
    glowBorder: 'rgba(239, 68, 68, 0.2)',
    glowShadow: 'rgba(239, 68, 68, 0.15)',
  },
};
