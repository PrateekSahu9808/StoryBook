import { Meta, StoryObj } from '@storybook/react/*';
import DonutChart from './DonutChart';

const meta: Meta<typeof DonutChart> = {
  title: 'Components/DonutChart',
  component: DonutChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DonutChart>;

export const Default: Story = {
  args: {
    radius: 60,
    lineWidth: 15,
    legendDetailsType: 'Scripts',
    isLegendEnabled:true,
    statusValues: [
      { status: 'Passed', value: 25 },
      { status: 'failed', value: 25 },
      { status: 'Warning', value: 25 },
      { status: 'skipped', value: 25 },
    ],
    gapAngle: 0.06,
  },
};
