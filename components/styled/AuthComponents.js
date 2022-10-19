import { Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const Page = styled(Flex)`
	align-items: center;
	justify-content: center;
	height: 100vh;
	flex-direction: column;
	width: 100vw;
	flex: 1;
	background-color: whitesmoke;
`;

export const Container = styled(Flex)`
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 95%;
	background-color: white;
	padding: 4rem 1rem;
	border-radius: 16px;
	@media only screen and (min-width: 840px) {
		width: 60%;
	}
`;
