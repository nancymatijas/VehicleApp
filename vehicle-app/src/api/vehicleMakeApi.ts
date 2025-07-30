import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type VehicleMake = {
  id: number;
  name: string;
  abrv: string;
};

export type SortField = 'id' | 'name' | 'abrv';
export type SortDirection = 'asc' | 'desc';

export type SortParams = {
  field: SortField;
  direction: SortDirection;
};

export type PagingParams = {
  page?: number;
  pageSize?: number;
};

export type VehicleMakeQueryParams = SortParams & PagingParams & {
  filterField?: 'name' | 'abrv';
  filterValue?: string;
};

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseApiKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string;

export const vehicleMakeApi = createApi({
  reducerPath: 'vehicleMakeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: supabaseUrl,
    prepareHeaders: (headers) => {
      headers.set('apikey', supabaseApiKey);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['VehicleMake'],
  endpoints: (builder) => ({
    getVehicleMakes: builder.query<VehicleMake[], VehicleMakeQueryParams | void>({
      query: (params) => {
        let url = 'VehicleMake';
        let queryParams: string[] = [];

        const page = params?.page ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const offset = (page - 1) * pageSize;
        queryParams.push(`limit=${pageSize}`);
        queryParams.push(`offset=${offset}`);

        const sortField = params?.field ?? 'id';
        const sortDir = params?.direction || 'asc';
        queryParams.push(`order=${sortField}.${sortDir}`);

        if (params?.filterField && params?.filterValue && params?.filterValue.trim() !== '') {
          queryParams.push(`${params.filterField}=ilike.*${params.filterValue.trim()}*`);
        }

        if (queryParams.length > 0) {
          url += '?' + queryParams.join('&');
        }

        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'VehicleMake' as const, id })),
              { type: 'VehicleMake', id: 'LIST' },
            ]
          : [{ type: 'VehicleMake', id: 'LIST' }],
    }),

    createVehicleMake: builder.mutation<VehicleMake, Omit<VehicleMake, 'id'>>({
      query: (newMake) => ({
        url: 'VehicleMake',
        method: 'POST',
        body: newMake,
      }),
      invalidatesTags: [{ type: 'VehicleMake', id: 'LIST' }],
    }),

    updateVehicleMake: builder.mutation<VehicleMake, VehicleMake>({
      query: ({ id, ...patch }) => ({
        url: `VehicleMake?id=eq.${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'VehicleMake', id: arg.id }],
    }),

    deleteVehicleMake: builder.mutation<{ id: number }, number>({
      query: (id) => ({
        url: `VehicleMake?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'VehicleMake', id }],
    }),
  }),
});

export const {
  useGetVehicleMakesQuery,
  useCreateVehicleMakeMutation,
  useUpdateVehicleMakeMutation,
  useDeleteVehicleMakeMutation,
} = vehicleMakeApi;
