import { apiRequestPost } from 'tucano/api';
import type { ApiRelationshipJSON } from 'tucano/api_types/relationships';

export const apiSubmitAccountNote = (id: string, value: string) =>
  apiRequestPost<ApiRelationshipJSON>(`v1/accounts/${id}/note`, {
    comment: value,
  });
