// import { Meta, StoryObj } from '@storybook/react';
// import RadialChart from './RadialChart';

// const meta: Meta<typeof RadialChart> = {
//   title: 'Components/RadialChart',
//   component: RadialChart,
//   argTypes: {
//     radius: { control: 'number' },
//     lineWidth: { control: 'number' },
//     statusValues: { control: 'object' },
//     onClick: { action: 'clicked' },
//   },
//   parameters: {
//     layout: 'centered',
//   },
// };

// export default meta;
// type Story = StoryObj<typeof RadialChart>;

// export const ChartWithStatus: Story = {
//   args: {
//     radius: 15,
//     lineWidth: 5,
//     statusValues: [
//       { status: 'Passed', value: 40 },
//       { status: 'Failed', value: 20 },
//       { status: 'Warning', value: 20 },
//       { status: 'Skipped', value: 20 },
//     ],
//     onClick: (status: string) => alert(`Status clicked: ${status}`),
//   },
// };

import { Meta, StoryObj } from '@storybook/react';
import RadialChart from './RadialChart';

const meta: Meta<typeof RadialChart> = {
  title: 'Components/RadialChart',
  component: RadialChart,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof RadialChart>;

export const DefaultChart: Story = {
  argTypes: {
    arcColor: { control: 'color' },
    backgroundColor: { control: 'color' },
    total: { control: 'number' },
    value: { control: 'number' },
    radius: { control: 'number' },
    lineWidth: { control: 'number' },
    animate: { control: 'boolean' },
    label: { control: 'text' },
    lineCap: {
      control: {
        type: 'radio',
        options: ['butt', 'square'],
      },
    },
    onClick: { action: 'clicked' },
  },
  args: {
    arcColor: '#71347B',
    backgroundColor: '#F0E7F4',
    total: 100,
    value: 70,
    radius: 60,
    lineWidth: 15,
    animate: true,
    label: 'Label',
    lineCap: 'round',
    onClick: () => {},
  },
};

export const ChartWithStatus: Story = {
  argTypes: {
    radius: { control: 'number' },
    lineWidth: { control: 'number' },
    statusValues: { control: 'object' },
    onClick: { action: 'clicked' },
  },
  args: {
    radius: 15,
    lineWidth: 5,
    statusValues: [
      { status: 'Passed', value: 40 },
      { status: 'Failed', value: 20 },
      { status: 'Warning', value: 20 },
      { status: 'Skipped', value: 20 },
    ],
    onClick: () =>{},
  },
};



