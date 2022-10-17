import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as lib from '../../lib/constants';

const tagTypes = ['Self'];

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${lib.api.backend}/api`,
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.token;
			if (token) {
				headers.set('authorization', token);
			}
			return headers;
		},
	}),
	tagTypes: tagTypes,
	endpoints: builder => ({
		getSelf: builder.query({
			query: () => `/auth/self`,
			providesTags: ['Self'],
		}),

		kyc: builder.mutation({
			query(body) {
				return {
					url: `/auth/kyc`,
					method: 'POST',
					body,
				};
			},
			invalidatesTags: ['Self'],
		}),

		login: builder.mutation({
			query(body) {
				return {
					url: `/auth/login`,
					method: 'POST',
					body,
				};
			},
		}),
		sendOtp: builder.mutation({
			query(body) {
				return {
					url: `/auth/forgot-password/otp`,
					method: 'POST',
					body,
				};
			},
		}),
		resetPassword: builder.mutation({
			query(body) {
				return {
					url: `/auth/forgot-password/change`,
					method: 'POST',
					body,
				};
			},
		}),
		register: builder.mutation({
			query(body) {
				return {
					url: `/auth/register`,
					method: 'POST',
					body,
				};
			},
			invalidatesTags: [],
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation, useGetSelfQuery } =
	userApi;
