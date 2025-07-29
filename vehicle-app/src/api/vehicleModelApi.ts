import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from './supabaseClient';

export type VehicleModel = {
  id: number;
  make_id: number;
  name: string;
  abrv: string;
};

export type VehicleModelWithMake = VehicleModel & {
  VehicleMake: { name: string } | null;
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

export type VehicleModelQueryParams = SortParams & PagingParams;

export const vehicleModelApi = createApi({
  reducerPath: 'vehicleModelApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['VehicleModel'],
  endpoints: (builder) => ({
    getVehicleModels: builder.query<VehicleModelWithMake[], VehicleModelQueryParams | void>({
      async queryFn(params) {
        const field = params?.field || 'id';
        const ascending = params?.direction !== 'desc';
        const page = params?.page ?? 1;
        const pageSize = params?.pageSize ?? 10;

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error } = await supabase
          .from('VehicleModel')
          .select(
            `
            id,
            name,
            abrv,
            make_id,
            VehicleMake(name)
            `,
            { count: 'exact' }
          )
          .order(field as string, { ascending })
          .range(from, to);

        if (error) return { error };

        const mappedData =
          data?.map((item) => ({
            ...item,
            VehicleMake: Array.isArray(item.VehicleMake) && item.VehicleMake.length > 0 ? item.VehicleMake[0] : null,
          })) || [];

        return { data: mappedData as VehicleModelWithMake[] };
      },
      providesTags: ['VehicleModel'],
    }),

    createVehicleModel: builder.mutation<VehicleModel, Omit<VehicleModel, 'id'>>({
      async queryFn(newModel) {
        const { data, error } = await supabase
          .from('VehicleModel')
          .insert([newModel])
          .single();
        if (error) return { error };
        return { data: data as VehicleModel };
      },
      invalidatesTags: ['VehicleModel'],
    }),

    updateVehicleModel: builder.mutation<VehicleModel, VehicleModel>({
      async queryFn(updatedModel) {
        const { id, ...rest } = updatedModel;
        const { data, error } = await supabase
          .from('VehicleModel')
          .update(rest)
          .eq('id', id)
          .single();
        if (error) return { error };
        return { data: data as VehicleModel };
      },
      invalidatesTags: ['VehicleModel'],
    }),

    deleteVehicleModel: builder.mutation<{ id: number }, number>({
      async queryFn(id) {
        const { error } = await supabase
          .from('VehicleModel')
          .delete()
          .eq('id', id)
          .single();
        if (error) return { error };
        return { data: { id } };
      },
      invalidatesTags: ['VehicleModel'],
    }),
  }),
});

export const {
  useGetVehicleModelsQuery,
  useCreateVehicleModelMutation,
  useUpdateVehicleModelMutation,
  useDeleteVehicleModelMutation,
} = vehicleModelApi;
