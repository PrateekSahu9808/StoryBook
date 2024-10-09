import './DonutChart.scss';
type Status = 'passed' | 'failed' | 'warning' | 'skipped';
type StatusValue = {
  status: Status;
  value: number;
};

type DonutChartProps = {
  radius: number;
  lineWidth: number;
  statusValues: StatusValue[];
  gapAngle?: number;
};

// Function to generate SVG arc paths
const calculateArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  const startX = x + radius * Math.cos(startAngle);
  const startY = y + radius * Math.sin(startAngle);
  const endX = x + radius * Math.cos(endAngle);
  const endY = y + radius * Math.sin(endAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
};

// Color mapping function
const useColorMappings = () => {
  return {
    colorMapping: {
      passed: '#016102',
      failed: '#C50303',
      warning: '#FF8B00',
      skipped: '#3C3838',
    },
  };
};

// Main DonutChart component
const DonutChart: React.FC<DonutChartProps> = ({
  radius = 60,
  lineWidth = 15,
  statusValues = [],
  gapAngle = 0.06,
}) => {
  const { colorMapping } = useColorMappings();
  const total = statusValues.reduce((acc, status) => acc + status.value, 0);
  const nonZeroValues = statusValues.filter((value) => value.value > 0);
  const totalGapAngle = gapAngle * nonZeroValues.length;
  let remainingAngle = 2 * Math.PI - totalGapAngle;
  let currentAngle = Math.PI / 2;
  const svgSize = (radius + lineWidth) * 2;
  const MIN_PERCENTAGE = 1;
  const MIN_ANGLE = (MIN_PERCENTAGE / 100) * (2 * Math.PI);
  let minAngleTotal = 0;

  nonZeroValues.forEach(({ value }) => {
    const valuePercentage = value / total;
    let angle = valuePercentage * (2 * Math.PI);
    angle = Math.max(angle, MIN_ANGLE);
    minAngleTotal += angle;
    remainingAngle -= angle;
  });

  return (
    <div className="donut-chart-container">
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
      >
        <g
          transform={`translate(${radius + lineWidth}, ${radius + lineWidth})`}
        >
          {nonZeroValues.map((status, i) => {
            const normalizedStatus = status.status.toLowerCase();
            const valuePercentage = status.value / total;
            let angle = valuePercentage * (2 * Math.PI);
            angle = Math.max(angle, MIN_ANGLE);
            angle += remainingAngle * (valuePercentage / (total / total));

            const endAngle = currentAngle + angle;
            const foregroundArcPath = calculateArc(
              0,
              0,
              radius,
              currentAngle,
              endAngle
            );
            const fullCirclePath = calculateArc(0, 0, radius, 0, 2 * Math.PI);
            currentAngle = endAngle + gapAngle;
            return (
              <g key={i}>
                <path
                  d={
                    nonZeroValues.length === 1 && nonZeroValues[0]
                      ? fullCirclePath
                      : foregroundArcPath
                  }
                  fill="none"
                  stroke={
                    colorMapping[normalizedStatus as keyof typeof colorMapping]
                  }
                  strokeWidth={lineWidth}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default DonutChart;
