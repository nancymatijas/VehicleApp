import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from './supabaseClient';

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

/**
 * filterField: polje po kojem se filtrira (name ili abrv)
 * filterValue: vrijednost za filtriranje (string)
 */
export type VehicleMakeQueryParams = SortParams & PagingParams & {
  filterField?: 'name' | 'abrv';
  filterValue?: string;
};

export const vehicleMakeApi = createApi({
  reducerPath: 'vehicleMakeApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['VehicleMake'],
  endpoints: (builder) => ({
    getVehicleMakes: builder.query<VehicleMake[], VehicleMakeQueryParams | void>({
      async queryFn(params) {
        const field = params?.field || 'id';
        const ascending = params?.direction !== 'desc';
        const page = params?.page ?? 1;
        const pageSize = params?.pageSize ?? 10;

        const filterField = params?.filterField;
        const filterValue = params?.filterValue;

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
          .from('VehicleMake')
          .select('*', { count: 'exact' })
          .order(field, { ascending })
          .range(from, to);

        if (filterField && filterValue && filterValue.trim() !== '') {
          query = query.ilike(filterField, `%${filterValue.trim()}%`);
        }

        const { data, error } = await query;

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
  }),
});

// Eksport hookova za korištenje u komponentama
export const {
  useGetVehicleMakesQuery,
  useCreateVehicleMakeMutation,
  useUpdateVehicleMakeMutation,
  useDeleteVehicleMakeMutation,
} = vehicleMakeApi;
