import { apiRequestGet } from 'tucano/api';
import type { ApiAccountJSON } from 'tucano/api_types/accounts';

export const apiGetDirectory = (
  params: {
    order: string;
    local: boolean;
    offset?: number;
  },
  limit = 20,
) =>
  apiRequestGet<ApiAccountJSON[]>('v1/directory', {
    ...params,
    limit,
  });
