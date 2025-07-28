import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from './supabaseClient';

// Tip za VehicleMake
export type VehicleMake = {
  id: number;
  name: string;
  abrv: string;
};

// Tip za VehicleModel sa relacijom VehicleMake
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
    // Read (GET) – dohvat svih proizvođača
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

    // Create (POST) – dodavanje novog proizvođača
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

    // Update (PUT/PATCH) – ažuriranje postojeće stavke
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

    // Delete (DELETE) – brisanje proizvođača po id-u
    deleteVehicleMake: builder.mutation<{ id: number }, number>({
      async queryFn(id) {
        const { data, error } = await supabase
          .from('VehicleMake')
          .delete()
          .eq('id', id)
          .single();

        if (error) return { error };
        return { data: { id } };
      },
      invalidatesTags: ['VehicleMake'],
    }),

    // Read (GET) – dohvat modela sa pripadajućim imenom proizvođača
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

        // mapiranje VehicleMake iz niza u objekat ili null
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

export const {
  useGetVehicleMakesQuery,
  useCreateVehicleMakeMutation,
  useUpdateVehicleMakeMutation,
  useDeleteVehicleMakeMutation,
  useGetVehicleModelsQuery,
} = vehicleApi;
