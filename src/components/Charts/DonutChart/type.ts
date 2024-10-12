export type Status =
  | 'passed'
  | 'failed'
  | 'warning'
  | 'skipped'
  | 'Passed'
  | 'Failed'
  | 'Warning'
  | 'Skipped';

type StatusValue = {
  status: Status;
  value: number;
};

export type DonutChartProps = {
  radius: number;
  lineWidth: number;
  statusValues: StatusValue[];
  legendDetailsType: string;
  gapAngle?: number;
  isLegendEnabled: boolean;
};
