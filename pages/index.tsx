import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Image from 'next/image';
import Layout from '../components/Layout';
import PrivacyPolicyAlert from '../components/PrivacyPolicyAlert';
import foodCollage from '../public/food_collage.jpg';

const Home: NextPage = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Stack py={5} spacing={5}>
          <PrivacyPolicyAlert />
          <Typography variant="h2">Welcome to Cookbook</Typography>
          <Typography variant="h5">
            Cookbook is a place to find popular food items and recommended foods
            by nutritionists. Search for foods above and favorite your best
            dishes!
          </Typography>
        </Stack>
      </Container>
      <Box height="40em" position="relative" overflow="hidden">
        <Image
          src={foodCollage}
          alt="Food collage"
          layout="fill"
          objectFit="cover"
          objectPosition="left 75%"
          placeholder="blur"
          priority
        />
      </Box>
    </Layout>
  );
};

export default Home;
