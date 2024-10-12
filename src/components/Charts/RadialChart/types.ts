type Status = {
    status: string;
    value: number;
  };
  
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
  }