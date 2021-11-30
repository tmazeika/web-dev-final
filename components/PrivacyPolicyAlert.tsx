import Alert from '@mui/material/Alert';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import type { FC } from 'react';
import useLocalBooleanStorage from '../hooks/useLocalBooleanStorage';

const PrivacyPolicyAlert: FC = () => {
  const [show, setShow] = useLocalBooleanStorage(
    'PrivacyPolicyAlert-show',
    true,
  );

  return !show ? null : (
    <Alert severity="info" onClose={() => setShow(false)}>
      Check out our{' '}
      <Link href="/privacy" passHref>
        <MuiLink>privacy policy</MuiLink>
      </Link>
      !
    </Alert>
  );
};

export default PrivacyPolicyAlert;
