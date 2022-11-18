import React, { useEffect, useState } from 'react';
import { useLoginMutation } from '../store/services/apiService';
import { useRouter } from 'next/router';

import {
	Flex,
	Text,
	Heading,
	Stack,
	Input,
	Button,
	useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Page, Container } from '../components/styled/AuthComponents';

/**
 * LOGIN PAGE FOR AUTHENTICATOR
 * if login is successful
 * 	1) checks for the age if > 17
 * 		- if > 17 : sends to kyc page
 * 		- if < 17 & unverified sends to choosing guardian page
 * 		- if < 17 & pending verification sends to waiting page
 * 		- if < 17 & verified sends to netsooon junior page
 *
 */

const Loginpage = () => {
	const router = useRouter();
	const toast = useToast();
	const { callback } = router.query;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [login, result] = useLoginMutation();

	/**functions */
	const submitFrom = e => {
		e.preventDefault();
		login({ email, password, callback });
	};

	/**useEffects */

	useEffect(() => {
		if (result.isLoading) return;

		if (result.isSuccess) {
			if (result?.data?.user?.age && result.data.user.age > 17) {
				router.push(`/kyc?token=${result.data.token}&callback=${callback}`);
			} else {
				if (
					result?.data?.user?.verificationStatus &&
					result.data.user.verificationStatus == 'init'
				) {
					router.push(
						`/setguardian?token=${result.data.token}&callback=${callback}`
					);
				} else if (
					result?.data?.user?.verificationStatus &&
					result.data.user.verificationStatus == 'pending'
				) {
					router.push(
						`/pending?token=${result.data.token}&callback=${callback}`
					);
				} else if (
					result?.data?.user?.verificationStatus &&
					result.data.user.verificationStatus == 'verified'
				) {
					router.replace(
						`${result?.data?.callback}?token=${result?.data?.token}`
					);
				}
			}
		}
	}, [result.isSuccess]);

	useEffect(() => {
		if (result.isLoading) return;
		if (result.isError) {
			toast({
				position: 'top',
				title: 'Could not log in',
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

	const submitButton = (
		<Button
			size='lg'
			type='submit'
			isLoading={result.isLoading}
			loadingText='Processing'
			backgroundColor='#003399'
			colorScheme='facebook'>
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
			<Link href={`/signup?callback=${callback}`}>
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
