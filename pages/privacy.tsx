import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import React from 'react';
import Layout from '../components/Layout';

const Privacy: NextPage = () => (
  <Layout>
    <Container maxWidth="md">
      <Stack py={5} spacing={2}>
        <Typography variant="h3">Privacy Policy</Typography>
        <Typography variant="caption">Last updated Dec 2, 2021</Typography>
        <p>
          Welcome to Cookbook! Your privacy is very important to us. Cookbook
          (hereinafter &quot;We&quot; or &quot;we&quot;) uses the following third party services to support the
          functionality on this site:
        </p>
        <ul>
          <li><MuiLink href="https://vercel.com">Vercel</MuiLink> &ndash; The Vercel platform hosts this website and may
            log your requests to this website including access time and IP address. We do not have access to such logs.
          </li>
          <li>
            <MuiLink href="https://firebase.google.com/">Firebase</MuiLink> &ndash; The Firebase platform stores your
            email and a cryptographic hash of your password when you create an account. We may view your email address,
            but not your password hash. We will never use your email address for any purpose other than to support your
            authentication to this website. Firebase may store a small file called a cookie on your device (in your
            browser) in order to enable you to stay signed in across pages and browsing sessions. When you sign out,
            this file is deleted. If you do not create an account on this website, no cookies will be stored on your
            device.
          </li>
          <li>
            <MuiLink href="https://fdc.nal.usda.gov/">FoodData Central</MuiLink> &ndash; This official government
            website, run by the U.S. Department of Agriculture, provides data about food items that are searchable on
            this site. The USDA may collect completely anonymized search queries that are generated when you enter a
            query into &quot;Search foods&quot; at the top of all pages.
          </li>
        </ul>
        <p>
          When you create a user account, you will provide us your email, a password, and your user role as a foodie or
          a nutritionist. The Firebase platform will store your username and a cryptographic hash of your password, but
          we will only store your Firebase user ID, not your email or password hash, along with your role. When you
          favorite a food item (as a foodie) or write a review (as a nutritionist), we will store that favorited food
          and review text. No other users or stakeholders will have access to the author (i.e. one&apos;s email address
          or other identifying information) of a review or favorite. If you write multiple reviews, the displayed
          &quot;author&quot; (i.e. a randomly generated username) will be the same across those reviews, and so it may
          be known that the same author (identified by this random username) has written one or multiple reviews and
          what they were.
        </p>
        <p>
          We will not sell or share any of your data for any purpose besides what&apos;s been described above. You are
          the owner of your data, and if you email us
          at <MuiLink href="mailto:mazeika.t@northeastern.edu">mazeika.t@northeastern.edu</MuiLink>, you may request
          that we delete your data from our databases and your user account from Firebase. Please provide the email
          address of the account whose information you&apos;d like us to delete.
        </p>
      </Stack>
    </Container>
  </Layout>
);

export default Privacy;
