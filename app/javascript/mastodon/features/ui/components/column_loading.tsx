import Column from 'tucano/components/column';
import { ColumnHeader } from 'tucano/components/column_header';
import type { Props as ColumnHeaderProps } from 'tucano/components/column_header';

export const ColumnLoading: React.FC<ColumnHeaderProps> = (otherProps) => (
  <Column>
    <ColumnHeader {...otherProps} />
    <div className='scrollable' />
  </Column>
);
