import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from './supabaseClient';

export type VehicleMake = {
  id: number;
  name: string;
  abrv: string;
};

export type VehicleModelWithMake = {
  id: number;
  make_id: number;
  name: string;
  abrv: string;
  VehicleMake: { name: string } | null;  
};

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['VehicleMake', 'VehicleModel'],
  endpoints: (builder) => ({
    getVehicleMakes: builder.query<VehicleMake[], void>({
      async queryFn() {
        const { data, error } = await supabase
          .from('VehicleMake')
          .select('*')
          .order('id');
        if (error) return { error };
        return { data: data as VehicleMake[] };
      },
      providesTags: ['VehicleMake'],
    }),

    getVehicleModels: builder.query<VehicleModelWithMake[], void>({
      async queryFn() {
        const { data, error } = await supabase
          .from('VehicleModel')
          .select(`
            id,
            name,
            abrv,
            make_id,
            VehicleMake(name)
          `)
          .order('id');

        if (error) return { error };

        // mapiraj VehicleMake iz niza u objekt
        const mappedData = data?.map((item) => ({
          ...item,
          VehicleMake: item.VehicleMake && item.VehicleMake.length > 0 ? item.VehicleMake[0] : null,
        })) || [];

        return { data: mappedData as VehicleModelWithMake[] };
      },
      providesTags: ['VehicleModel'],
    }),
  }),
});

export const { useGetVehicleMakesQuery, useGetVehicleModelsQuery } = vehicleApi;
