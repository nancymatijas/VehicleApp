import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type VehicleModel = {
  id: number;
  make_id: number;
  name: string;
  abrv: string;
};

export type VehicleMake = {
  name: string;
};

export type VehicleModelWithMake = VehicleModel & {
  VehicleMake: VehicleMake | null;
};

export type SortField = 'id' | 'name' | 'abrv' | 'make_id';
export type SortDirection = 'asc' | 'desc';

export type SortParams = {
  field: SortField;
  direction: SortDirection;
};

export type PagingParams = {
  page?: number;
  pageSize?: number;
};

export type FilterFieldModel = 'name' | 'abrv' | 'make_id';

export type VehicleModelQueryParams = SortParams & PagingParams & {
  filterField?: FilterFieldModel;
  filterValue?: string;
};

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseApiKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseApiKey) {
  throw new Error('SUPABASE_URL i SUPABASE_API_KEY moraju biti definirani u .env');
}

export const vehicleModelApi = createApi({
  reducerPath: 'vehicleModelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: supabaseUrl,
    prepareHeaders: (headers) => {
      headers.set('apikey', supabaseApiKey);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['VehicleModel'],
  endpoints: (builder) => ({
    getVehicleModels: builder.query<VehicleModelWithMake[], VehicleModelQueryParams | void>({
      query: (params) => {
        let url = 'VehicleModel';
        const queryParams: string[] = [];

        const page = params?.page ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const offset = (page - 1) * pageSize;
        queryParams.push(`limit=${pageSize}`);
        queryParams.push(`offset=${offset}`);

        const sortField = params?.field ?? 'id';
        const sortDirection = params?.direction ?? 'asc';
        queryParams.push(`order=${sortField}.${sortDirection}`);

        if (params?.filterField && params?.filterValue && params.filterValue.trim() !== '') {
          if (params.filterField === 'make_id') {
            queryParams.push(`${params.filterField}=eq.${params.filterValue.trim()}`);
          } else {
            queryParams.push(`${params.filterField}=ilike.*${params.filterValue.trim()}*`);
          }
        }

        queryParams.push('select=id,name,abrv,make_id,VehicleMake(name)');

        if (queryParams.length > 0) {
          url += '?' + queryParams.join('&');
        }

        return { url, method: 'GET' };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'VehicleModel' as const, id })),
              { type: 'VehicleModel', id: 'LIST' },
            ]
          : [{ type: 'VehicleModel', id: 'LIST' }],
    }),

    createVehicleModel: builder.mutation<VehicleModel, Omit<VehicleModel, 'id'>>({
      query: (newModel) => ({
        url: 'VehicleModel',
        method: 'POST',
        body: newModel,
      }),
      invalidatesTags: [{ type: 'VehicleModel', id: 'LIST' }],
    }),

    updateVehicleModel: builder.mutation<VehicleModel, VehicleModel>({
      query: ({ id, ...patch }) => ({
        url: `VehicleModel?id=eq.${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'VehicleModel', id: arg.id }],
    }),

    deleteVehicleModel: builder.mutation<{ id: number }, number>({
      query: (id) => ({
        url: `VehicleModel?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'VehicleModel', id }],
    }),
  }),
});

export const {
  useGetVehicleModelsQuery,
  useCreateVehicleModelMutation,
  useUpdateVehicleModelMutation,
  useDeleteVehicleModelMutation,
} = vehicleModelApi;
