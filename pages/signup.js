import React, { useEffect, useState } from 'react';
import { useRegisterMutation } from '../store/services/apiService';
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
	useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Page, Container } from '../components/styled/AuthComponents';

const SignupPage = () => {
	const router = useRouter();
	const { callback } = router.query;
	const toast = useToast();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [age, setAge] = useState('');

	const [register, result] = useRegisterMutation();

	/**functions */
	const submitFrom = e => {
		e.preventDefault();
		register({ name, email, password, confirm, age });
	};

	/**useEffects */

	useEffect(() => {
		if (result.isSuccess) {
			if (result?.data?.data && result.data.data.age > 17) {
				router.push(
					`/kyc?token=${
						result?.data?.token && result.data.token
					}&callback=${callback}`
				);
			} else {
				router.push(
					`/setguardian?token=${
						result?.data?.token && result.data.token
					}&callback=${callback}`
				);
			}
		}
	}, [result.isSuccess]);

	useEffect(() => {
		if (result.isError) {
			toast({
				position: 'top',
				title: 'Error Signing Up',
				status: 'error',
				variant: 'left-accent',
				isClosable: true,
				description: result?.error?.data?.message && result.error.data.message,
				containerStyle: {
					minWidth: '300px',
				},
			});
		}
	}, [result.isLoading]);

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
				placeholder='Full Name'
				size='md'
				value={name}
				onChange={e => setName(e.target.value)}
				required
			/>
			<Input
				placeholder='Email'
				size='md'
				value={email}
				onChange={e => setEmail(e.target.value)}
				required
			/>
			<Input
				placeholder='Age'
				size='md'
				value={age}
				onChange={e => setAge(e.target.value)}
				required
				type='number'
			/>
			<Input
				placeholder='Password'
				size='md'
				type='password'
				value={password}
				onChange={e => setPassword(e.target.value)}
				required
			/>
			<Input
				placeholder='Confirm Password'
				size='md'
				type='password'
				value={confirm}
				onChange={e => setConfirm(e.target.value)}
				required
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
			size='md'
			type='submit'
			isLoading={result.isLoading}
			loadingText='Processing'
			backgroundColor='#003399'
			colorScheme='facebook'>
			Sign Up
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
			<Link href={`/login?callback=${callback}`}>
				<Text size='lg' cursor='pointer' fontWeight={700}>
					Log In
				</Text>
			</Link>
		</Flex>
	);

	return (
		<Page>
			<Container boxShadow='base'>
				<Stack spacing={4} minW={300} maxW={400}>
					<>{title}</>
					<form onSubmit={submitFrom} style={{ width: '100%' }}>
						<Stack spacing={3}>
							<>{inputs}</>
							{/* <>{error}</> */}
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

export default SignupPage;
