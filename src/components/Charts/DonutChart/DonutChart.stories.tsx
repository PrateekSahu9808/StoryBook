import { Meta,StoryObj } from "@storybook/react/*";
import DonutChart from "./DonutChart";

const meta: Meta<typeof DonutChart> = {
    title: "Components/DonutChart",
    component: DonutChart,
    parameters: {
        layout: "centered",
    },
  tags: ['autodocs'],

    
}
export default meta;

type Story = StoryObj<typeof DonutChart>;

export const Default: Story = {
  args: {
    radius: 60,
    lineWidth: 15,
    statusValues: [
      { status: 'passed', value: 100},
      { status: 'failed', value: 100},
      { status: 'warning', value:100},
      { status: 'skipped', value:100 },
    ],

  },
}