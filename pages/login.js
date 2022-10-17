import React, { useEffect, useState } from 'react';
import { useLoginMutation } from '../store/services/apiService';
import { loginAction } from '../store/slices/authSlice';
import { useRouter } from 'next/router';

import {
	Flex,
	Text,
	Heading,
	Stack,
	Input,
	Button,
	Alert,
	AlertIcon,
	AlertDescription,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import Link from 'next/link';

const Page = styled(Flex)`
	align-items: center;
	justify-content: center;
	height: 100vh;
	flex-direction: column;
	width: 100vw;
	flex: 1;
	background-color: whitesmoke;
`;

const Container = styled(Flex)`
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 60%;
	background-color: white;
	padding: 4rem 1rem;
	border-radius: 16px;
`;

const Loginpage = () => {
	const router = useRouter();
	const { callback } = router.query;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [login, result] = useLoginMutation();

	/**functions */
	const submitFrom = e => {
		e.preventDefault();
		login({ email, password });
	};

	/**useEffects */

	useEffect(() => {
		if (result.isSuccess) {
			router.push(
				`${callback ? callback : 'https://localhost'}?token=${
					result?.data?.token ? result.data.token : 'invalid'
				}`
			);
		}
		//result.isSuccess && dispatch(loginAction(result.data.token));
	}, [result.isSuccess]);

	/**Components */
	const title = (
		<Stack>
			<Heading size='md'>Log In</Heading>

			<Text>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, ipsum dolor sit
				amet
			</Text>
		</Stack>
	);
	const inputs = (
		<>
			<Input
				placeholder='Email'
				value={email}
				onChange={e => setEmail(e.target.value)}
				size='lg'
				required
			/>
			<Input
				value={password}
				placeholder='Password'
				size='lg'
				type='password'
				required
				onChange={e => setPassword(e.target.value)}
			/>
		</>
	);

	const error = result.isError && (
		<Alert status='error'>
			<AlertIcon />
			<AlertDescription>
				{result?.error?.data?.message && result.error.data.message}
			</AlertDescription>
		</Alert>
	);

	const submitButton = (
		<Button
			size='lg'
			type='submit'
			isLoading={result.isLoading}
			loadingText='Processing'>
			Log In
		</Button>
	);

	const termsOfUse = (
		<Flex justifyContent='center'>
			<Text fontSize='xs' textAlign='center' maxW={300}>
				{`By proceeding, you agree to Netsoon’s Terms of Use & Privacy Policy`}
			</Text>
		</Flex>
	);

	const signupButton = (
		<Flex mt={16} alignItems='center' flexDirection='column'>
			<Text>Do not have an account?</Text>
			<Link href='/register'>
				<Text size='lg' cursor='pointer' fontWeight={700}>
					Sign Up
				</Text>
			</Link>
		</Flex>
	);

	return (
		<Page>
			<Container boxShadow='base'>
				<Stack spacing={8} minW={300} maxW={400}>
					<>{title}</>
					<form onSubmit={submitFrom} style={{ width: '100%' }}>
						<Stack spacing={3}>
							<>{inputs}</>
							<>{error}</>
							<>{submitButton}</>
							<>{termsOfUse}</>
						</Stack>
					</form>
				</Stack>
				<>{signupButton}</>
			</Container>
		</Page>
	);
};

export default Loginpage;
