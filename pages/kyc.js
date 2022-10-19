import React, { useState, useEffect, useRef } from 'react';
import { Heading, Stack, Button, Center } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import SumsubWebSdk from '@sumsub/websdk-react';
import snsWebSdk from '@sumsub/websdk';
import { Page, Container } from '../components/styled/AuthComponents';
import {
	useGetAccessTokenQuery,
	useGetApplicationStatusQuery,
} from '../store/services/kycService';

const Kycpage = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { callback, token } = router.query;

	const [id, setId] = useState('');

	const kycRef = useRef(null);

	const accessToken = '';
	const { data, isLoading, isError } = useGetAccessTokenQuery(token);
	const {
		data: statusData,
		isLoading: statusLoading,
		isError: statusError,
	} = useGetApplicationStatusQuery({ id, token });

	const errorHandler = error => {
		console.log('onError', error);
	};

	const messageHandler = (type, payload) => {
		console.log(type, payload);
		if (type == 'idCheck.onReady') {
			console.log('i am ready to run');
		}
		if (type == 'idCheck.onApplicantLoaded') {
			console.log(payload);
			setId(payload?.applicantId && payload.applicantId);
		}
	};

	useEffect(() => {
		if (!statusLoading && statusData) {
			console.log(statusData?.data?.reviewStatus);
			if (
				statusData?.data?.reviewStatus &&
				statusData.data.reviewStatus == 'pending'
			) {
				router.replace(`/pending?callback=${callback}`);
			}
			if (
				statusData?.data?.reviewStatus &&
				statusData.data.reviewStatus == 'completed'
			) {
				if (statusData.data.reviewResult.reviewAnswer == 'GREEN') {
					router.replace(`${callback}?token=${token}`);
				}
			}
		}
	}, [statusLoading]);

	const accessTokenExpirationHandler = async () => {
		console.log('token has expired');
		try {
			let snsWebSdkInstance = await snsWebSdk
				.init(
					accessToken,
					// token update callback, must return Promise
					// Access token expired
					// get a new one and pass it to the callback to re-initiate the WebSDK
					() => this.getNewAccessToken()
				)
				.withConf({
					lang: 'en', //language of WebSDK texts and comments (ISO 639-1 format)
				})
				.on('onError', error => {
					console.log('onError', error);
				})
				.onMessage((type, payload) => {
					console.log('onMessage', type, payload);
				})
				.build();
		} catch (e) {
			console.log(e.message);
		}
	};

	return (
		<Page>
			<Container>
				<Heading size='lg' mb={4}>
					KYC
				</Heading>

				{isLoading && isError && !data ? (
					<Center>Loading...</Center>
				) : (
					data?.data?.token && (
						<SumsubWebSdk
							ref={kycRef}
							accessToken={data?.data?.token && data.data.token}
							config={{
								lang: 'en', //language of WebSDK texts and comments (ISO 639-1 format)
							}}
							expirationHandler={accessTokenExpirationHandler}
							onMessage={messageHandler}
							onError={errorHandler}
							onReady={() => console.log('i am ready')}
							options={{ addViewportTag: false, adaptIframeHeight: true }}
							onApplicantLoaded={() => {
								console.log('applicant loaded');
							}}
						/>
					)
				)}
			</Container>
		</Page>
	);
};

export default Kycpage;
