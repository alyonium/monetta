import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ROUTE } from '@/constants/router.ts';
import { setAccessToken, setBackendUrl } from '@/helpers/authStorage.ts';
import { configureApiClient } from '@/helpers/configureApiClient.ts';
import { LOGIN_FAILURE_REASON } from '@/modules/login/constants.ts';
import { verifyFireflyLogin } from '@/modules/login/helpers/verifyFireflyLogin.ts';

type LoginFormValues = {
  token: string;
  backendUrl: string;
};

export const useLoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      token: '',
      backendUrl: '',
    },
    validate: {
      token: (value) => (value.trim() ? null : t('login.errors.tokenRequired')),
      backendUrl: (value) =>
        value.trim() ? null : t('login.errors.backendUrlRequired'),
    },
  });

  const showUnexpectedError = (error: unknown) => {
    console.error(error);
    setUnexpectedError(t('login.errors.unexpected'));
  };

  const handleSubmit = form.onSubmit(async (values) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setUnexpectedError(null);

    const token = values.token.trim();
    const backendUrl = values.backendUrl.trim();

    try {
      const result = await verifyFireflyLogin({ token, backendUrl });

      if (result.ok) {
        setAccessToken(token);
        setBackendUrl(backendUrl);
        configureApiClient({ token, backendUrl });
        navigate(ROUTE.BUDGET);
        return;
      }

      switch (result.reason) {
        case LOGIN_FAILURE_REASON.INVALID_TOKEN:
          form.setFieldError('token', t('login.errors.invalidToken'));
          return;
        case LOGIN_FAILURE_REASON.INVALID_BACKEND_URL:
          form.setFieldError('backendUrl', t('login.errors.invalidBackendUrl'));
          return;
        default: {
          const unexpectedReason: never = result.reason;
          showUnexpectedError(unexpectedReason);
        }
      }
    } catch (error) {
      showUnexpectedError(error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, isSubmitting, unexpectedError, handleSubmit };
};
