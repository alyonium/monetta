import {
  Anchor,
  Button,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';
import spotUrl from '@/assets/spot.svg';
import { FIREFLY_SITE_URL } from '@/modules/login/constants.ts';
import { useLoginForm } from '@/modules/login/hooks/useLoginForm.ts';
import styles from './Login.module.css';

const fieldClassNames = {
  root: styles.field,
  label: styles.fieldLabel,
  wrapper: styles.inputBox,
  error: styles.fieldError,
};

const Login = () => {
  const { t } = useTranslation();
  const { form, isSubmitting, unexpectedError, handleSubmit } = useLoginForm();

  return (
    <main className={styles.page}>
      <div className={styles.spotWrap} aria-hidden>
        <img src={spotUrl} alt='' className={styles.spot} draggable={false} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <Title>{t('login.title')}</Title>
          <Text c='dimmed'>{t('login.subtitle')}</Text>
        </div>

        <PasswordInput
          label={t('login.token')}
          autoComplete='off'
          classNames={fieldClassNames}
          {...form.getInputProps('token')}
        />

        <TextInput
          label={t('login.backendUrl')}
          placeholder={t('login.backendUrlPlaceholder')}
          autoComplete='url'
          classNames={fieldClassNames}
          {...form.getInputProps('backendUrl')}
        />

        {unexpectedError ? (
          <Text c='red' size='sm'>
            {unexpectedError}
          </Text>
        ) : null}

        <Button
          type='submit'
          variant='gradient'
          gradient={{ from: 'indigo.8', to: 'indigo.4', deg: 90 }}
          loading={isSubmitting}
          fullWidth
        >
          {t('login.signIn')}
        </Button>

        <Text className={styles.footer} size='sm' c='dimmed'>
          <Trans
            i18nKey='login.fireflyCredit'
            components={{
              fireflyLink: (
                <Anchor
                  href={FIREFLY_SITE_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </Text>
      </form>
    </main>
  );
};

export default Login;
