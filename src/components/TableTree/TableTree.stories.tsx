import type { Meta, StoryObj } from '@storybook/react';
import TableTree from './TableTree';
import treeData from './data';

const meta: Meta<typeof TableTree> = {
  title: 'Components/Table tree',
  component: TableTree,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof TableTree>;

export const Default: Story = {
  args: {
    withCheckBox: false,
    treeData,
    columnsData: [
      {
        name: 'Search key',
        accessor: 'searchKey',
        width: '200px',
        isClickable: true,
      },
      { name: 'Execution', accessor: 'executionOrder', width: '200px' },
      { name: 'state', accessor: 'state', width: '200px' },
      { name: 'createdByUname', accessor: 'createdByUname', width: '200px' },
      {
        name: 'moduleLevelScriptCount',
        accessor: 'moduleLevelScriptCount',
        width: '200px',
      },
    ],
    onClick: (e, data) => {
      console.log('🚀 ~ e, data:', e, data);
    },
  },
};

export default meta;
