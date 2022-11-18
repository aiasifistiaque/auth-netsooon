import {
	Stack,
	Heading,
	Text,
	Input,
	Button,
	useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Page, Container } from '../components/styled/AuthComponents';
import { useAssignGuardianMutation } from '../store/services/apiService';

const Setguardian = () => {
	const toast = useToast();
	const router = useRouter();
	const { token } = router.query;

	const [email, setEmail] = useState();
	const [assign, result] = useAssignGuardianMutation();

	useEffect(() => {
		if (result.isLoading) return;

		if (result.isSuccess) {
			router.push(`/pending`);
		}
	}, [result.isSuccess]);

	useEffect(() => {
		if (result.isLoading) return;
		if (result.isError) {
			toast({
				position: 'top',
				title: 'Error',
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

	const onAssignHandler = e => {
		e.preventDefault();
		assign({ email, token });
	};

	const title = (
		<Stack>
			<Heading size='md'>Assign Guardian</Heading>
			<Text>
				Please enter the email address of your guardian. We will notify your
				guardian to accept your request. If your guardian is not registered with
				netsooon, he/she can open a netsooon account with the provided email and
				approve your request.
			</Text>
		</Stack>
	);
	const inputs = (
		<>
			<Input
				placeholder='Please enter the email address'
				size='md'
				type='email'
				value={email}
				onChange={e => setEmail(e.target.value)}
				required
			/>
		</>
	);

	const submitButton = (
		<Button
			size='md'
			type='submit'
			isLoading={result.isLoading}
			loadingText='Processing...'
			backgroundColor='#003399'
			colorScheme='facebook'>
			Confirm
		</Button>
	);

	return (
		<Page>
			<Container boxShadow='base'>
				<Stack spacing={4} minW={300} maxW={400}>
					<>{title}</>
					<form style={{ width: '100%' }} onSubmit={onAssignHandler}>
						<Stack spacing={3} mt={4}>
							<>{inputs}</>
							<>{submitButton}</>
						</Stack>
					</form>
				</Stack>
			</Container>
		</Page>
	);
};

export default Setguardian;
