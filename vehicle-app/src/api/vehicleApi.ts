import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from './supabaseClient';

export type VehicleMake = {
  id: number;
  name: string;
  abrv: string;
};

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

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['VehicleMake', 'VehicleModel'],
  endpoints: (builder) => ({
    // VehicleMake endpoints

    getVehicleMakes: builder.query<VehicleMake[], SortParams | void>({
      async queryFn(sortParams) {
        const field = sortParams?.field || 'id';
        const ascending = sortParams?.direction !== 'desc';

        const { data, error } = await supabase
          .from('VehicleMake')
          .select('*')
          .order(field, { ascending });

        if (error) return { error };
        return { data: data as VehicleMake[] };
      },
      providesTags: ['VehicleMake'],
    }),

    createVehicleMake: builder.mutation<VehicleMake, Omit<VehicleMake, 'id'>>({
      async queryFn(newMake) {
        const { data, error } = await supabase
          .from('VehicleMake')
          .insert([newMake])
          .single();

        if (error) return { error };
        return { data: data as VehicleMake };
      },
      invalidatesTags: ['VehicleMake'],
    }),

    updateVehicleMake: builder.mutation<VehicleMake, VehicleMake>({
      async queryFn(updatedMake) {
        const { id, ...rest } = updatedMake;
        const { data, error } = await supabase
          .from('VehicleMake')
          .update(rest)
          .eq('id', id)
          .single();

        if (error) return { error };
        return { data: data as VehicleMake };
      },
      invalidatesTags: ['VehicleMake'],
    }),

    deleteVehicleMake: builder.mutation<{ id: number }, number>({
      async queryFn(id) {
        const { error } = await supabase
          .from('VehicleMake')
          .delete()
          .eq('id', id)
          .single();

        if (error) return { error };
        return { data: { id } };
      },
      invalidatesTags: ['VehicleMake'],
    }),

    // VehicleModel endpoints

    getVehicleModels: builder.query<VehicleModelWithMake[], SortParams | void>({
      async queryFn(sortParams) {
        const field = sortParams?.field || 'id';
        const ascending = sortParams?.direction !== 'desc';

        const { data, error } = await supabase
          .from('VehicleModel')
          .select(`
            id,
            name,
            abrv,
            make_id,
            VehicleMake(name)
          `)
          .order(field, { ascending });

        if (error) return { error };

        // Supabase vraća VehicleMake kao niz, mapiramo u objekt ili null
        const mappedData = data?.map((item) => ({
          ...item,
          VehicleMake:
            Array.isArray(item.VehicleMake) && item.VehicleMake.length > 0
              ? item.VehicleMake[0]
              : null,
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
  useGetVehicleMakesQuery,
  useCreateVehicleMakeMutation,
  useUpdateVehicleMakeMutation,
  useDeleteVehicleMakeMutation,

  useGetVehicleModelsQuery,
  useCreateVehicleModelMutation,
  useUpdateVehicleModelMutation,
  useDeleteVehicleModelMutation,
} = vehicleApi;
