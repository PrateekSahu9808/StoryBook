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
        options: ['square', 'round'],
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
export const RadialBarChart:Story={
  argTypes: {
    barValues: { control: 'object' },
    radius: { control: 'number' },
    lineWidth: { control: 'number' },
    animate: { control: 'boolean' },
    labelHeading:{control:'text'},
    lineCap: {
      control: {
        type: 'radio',
        options: ['square', 'round'],
      },
    },
  },
  args:{
  radius:50,
  lineWidth:10,
  labelHeading:'Total Memory',
  barValues:[
    {value:10 ,arcColor: '#3B82F6', arcBackgroundColor: '#DBEAFE',barLabel:'Available Memory'},
    {value:20 , arcColor: '#10B981', arcBackgroundColor: '#D1FAE5',barLabel:'Assigned Memory' },
    {value:30 ,arcColor: '#F59E0B', arcBackgroundColor: '#FEF3C7',barLabel:'usedMemory'},
 
  ],
  lineCap: 'round',
}
}
export const ChartWithStatus: Story = {
  argTypes: {
    radius: { control: 'number' },
    lineWidth: { control: 'number' },
    statusValues: { control: 'object' },
    onClick: { action: 'clicked' },
  },
  args: {
    radius: 20,
    lineWidth: 5,
    statusValues: [
      { status: 'Passed', value: 40 },
      { status: 'Failed', value: 20 },
      { status: 'Warning', value: 20 },
      { status: 'Skipped', value: 20 },
    ],
    onClick: () => {},
  },
};
