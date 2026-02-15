import { useTheme } from '../context/ThemeContext';

export const useTranslation = () => {
  const { t } = useTheme();
  return { t };
};
