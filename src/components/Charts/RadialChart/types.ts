type Status = {
    status: string;
    value: number;
  };
type BarStatus={
  value: number;
  arcColor: string;
  arcBackgroundColor: string;
  barLabel: string;
  
}
 export interface RadialChartProps {
    radius: number;
    lineWidth: number;
    statusValues: Status[];
    onClick?: () => void;
    arcColor: string;
    backgroundColor: string;
    value: number;
    total: number;
    animate: boolean;
    label: string;
    lineCap: 'square' | 'round';
    barValues:BarStatus[];
    labelHeading:string;
    
  }