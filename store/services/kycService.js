import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as lib from '../../lib/constants';

const tagTypes = [];

export const kycApi = createApi({
	reducerPath: 'kycApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${lib.api.backend}/api/kyc`,
	}),
	tagTypes: tagTypes,
	endpoints: builder => ({
		getAccessToken: builder.query({
			query: token => `/token/${token}`,
			providesTags: [],
		}),
		getApplicationStatus: builder.query({
			query: ({ id, token }) => `/status/${id}?token=${token}`,
			providesTags: [],
		}),

		// register: builder.mutation({
		// 	query(body) {
		// 		return {
		// 			url: `/auth/register`,
		// 			method: 'POST',
		// 			body,
		// 		};
		// 	},
		// 	invalidatesTags: [],
		// }),
	}),
});

export const { useGetAccessTokenQuery, useGetApplicationStatusQuery } = kycApi;
