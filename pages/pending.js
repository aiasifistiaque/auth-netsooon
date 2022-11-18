import React, { useEffect, useState } from 'react';
import { useLoginMutation } from '../store/services/apiService';
import { useRouter } from 'next/router';
import { Puff } from 'react-loader-spinner';

import { Flex, Text, Heading, Stack, Center } from '@chakra-ui/react';
import Link from 'next/link';
import { Page, Container } from '../components/styled/AuthComponents';

const Pendingpage = () => {
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
	}, [result.isSuccess]);

	/**Components */
	const title = (
		<Center flexDir='column' gap={8}>
			<Heading textAlign='center' size='lg'>
				Verification In Progress
			</Heading>

			<Puff
				height='80'
				width='80'
				radisu={1}
				color='#003399'
				ariaLabel='puff-loading'
				wrapperStyle={{}}
				wrapperClass=''
				visible={true}
			/>

			<Text textAlign='center'>
				We are currently verifiying the information you provided. You will be
				notified as soon as the verification process is completed.
			</Text>
		</Center>
	);

	return (
		<Page>
			<Container boxShadow='base'>
				<Stack spacing={8} minW={300} maxW={400}>
					<>{title}</>

					<Stack spacing={3}></Stack>
				</Stack>
			</Container>
		</Page>
	);
};

export default Pendingpage;
