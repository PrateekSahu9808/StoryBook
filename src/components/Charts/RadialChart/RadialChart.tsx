import React, { useEffect, useState } from 'react';
import './RadialChart.scss';
import { RadialChartProps } from './types';

const colorMapping: { [key: string]: string } = {
  Passed: '#016102',
  Failed: '#C60202',
  Warning: '#FF8B00',
  Skipped: '#610B86',
};

const backgroundColorMapping: { [key: string]: string } = {
  Passed: '#C6EFCD',
  Failed: '#F7D9D9',
  Warning: '#FFD39E',
  Skipped: '#C4C3C3',
};

const calculateArc = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const startX = centerX + radius * Math.cos(startAngle);
  const startY = centerY + radius * Math.sin(startAngle);
  const endX = centerX + radius * Math.cos(endAngle);
  const endY = centerY + radius * Math.sin(endAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return `
    M ${startX} ${startY}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
  `;
};

const RadialChart: React.FC<RadialChartProps> = ({
  radius,
  lineWidth,
  statusValues,
  onClick,
  value,
  total,
  arcColor,
  backgroundColor,
  animate,
  label,
  lineCap,
  barValues,
  labelHeading,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  useEffect(() => {
    if (animate) {
      const increment = total / 100;
      const animateProgress = () => {
        setAnimatedValue((prev) => {
          if (prev >= value) return value;
          requestAnimationFrame(animateProgress);
          return prev + increment;
        });
      };

      animateProgress();
    } else {
      setAnimatedValue(value);
    }
  }, [animate, value, total]);

  if (statusValues) {
    const totalValue = statusValues.reduce(
      (acc, status) => acc + status.value,
      0
    );
    let currentAngle = -Math.PI / 2;

    return (
      <>
        {statusValues.map((status) => {
          const percentage = status.value / totalValue;
          let angleIncrement = percentage * 2 * Math.PI;
          let startAngle = currentAngle;
          let endAngle = startAngle + angleIncrement;

          if (status.value === totalValue) {
            startAngle = 0;
            endAngle = 2 * Math.PI;
          }

          const backgroundArcPath = calculateArc(0, 0, radius, 0, 2 * Math.PI);
          const foregroundArcPath = calculateArc(
            0,
            0,
            radius,
            startAngle,
            endAngle
          );

          currentAngle = endAngle;

          return (
            <svg
              key={status.status}
              className="radial-chart"
              width={2 * (radius + lineWidth)}
              height={2 * (radius + lineWidth)}
              viewBox={`0 0 ${2 * (radius + lineWidth)} ${
                2 * (radius + lineWidth)
              }`}
              onClick={() => onClick?.()}
            >
              <g
                transform={`translate(${radius + lineWidth}, ${
                  radius + lineWidth
                })`}
              >
                {/* Background Circle */}
                <path
                  d={backgroundArcPath}
                  fill="none"
                  stroke={backgroundColorMapping[status.status]}
                  strokeWidth={lineWidth}
                />
                {/* Status Arc */}
                <path
                  d={foregroundArcPath}
                  fill="none"
                  stroke={colorMapping[status.status]}
                  strokeWidth={lineWidth}
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} // Animation effect
                />
                {/* Percentage Text */}
                <text
                  x="0"
                  y="0"
                  fill={colorMapping[status.status]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="radial-chart-text"
                >
                  {`${Math.round(percentage * 100)}%`}
                </text>
              </g>
            </svg>
          );
        })}
      </>
    );
  } else if (value) {
    const backgroundArcPath = calculateArc(0, 0, radius, 0, 2 * Math.PI);
    const foregroundArcPath =
      animatedValue === total
        ? calculateArc(0, 0, radius, 0, 2 * Math.PI)
        : calculateArc(
            0,
            0,
            radius,
            -Math.PI / 2,
            -Math.PI / 2 + (animatedValue / total) * 2 * Math.PI * 0.99
          );

    return (
      <>
        {
          <svg
            width={2 * (radius + lineWidth)}
            height={2 * (radius + lineWidth)}
            viewBox={`0 0 ${2 * (radius + lineWidth)} ${
              2 * (radius + lineWidth)
            }`}
            onClick={() => onClick?.()}
          >
            <g
              transform={`translate(${radius + lineWidth}, ${
                radius + lineWidth
              })`}
            >
              {/* Background Arc */}
              <path
                d={backgroundArcPath}
                fill="none"
                stroke={backgroundColor}
                strokeWidth={lineWidth}
              />
              {/* Foreground Arc */}
              <path
                d={foregroundArcPath}
                fill="none"
                stroke={arcColor}
                strokeWidth={lineWidth}
                strokeLinecap={lineCap === 'square' ? 'butt' : 'round'}
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
              {/* Percentage Text */}
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={arcColor}
              >
                {label}
              </text>
              <text
                x="0"
                y="20"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={arcColor}
              >
                {`${Math.round((animatedValue / total) * 100)}%`}
              </text>
            </g>
          </svg>
        }
      </>
    );
  } else if (barValues.length) {
    const totalBarValue = barValues.reduce(
      (acc, status) => acc + status.value,
      0
    );
    const baseRadius = radius;
    const radiusIncrement = lineWidth + 10;
    const maxRadius = baseRadius + radiusIncrement * (barValues.length - 1);
    const svgSize = 2 * (maxRadius + lineWidth);

    // Reverse the array to render inner circles on top
    const reversedBarValues = [...barValues].reverse();
    return (
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="absolute top-0 left-0"
        >
          <g transform={`translate(${svgSize / 2}, ${svgSize / 2})`}>
            {reversedBarValues.map((values, i) => {
              const originalIndex = barValues.length - 1 - i;
              const percentage = values.value / totalBarValue;
              const angleIncrement = percentage * 2 * Math.PI;
              let startAngle = -Math.PI / 2;
              let endAngle = startAngle + angleIncrement;

              if (values.value === totalBarValue) {
                startAngle = 0;
                endAngle = 2 * Math.PI;
              }

              const currentRadius =
                baseRadius + radiusIncrement * originalIndex;
              const backGroundArcPath = calculateArc(
                0,
                0,
                currentRadius,
                0,
                2 * Math.PI
              );
              const foregroundArcPath = calculateArc(
                0,
                0,
                currentRadius,
                startAngle,
                endAngle
              );

              return (
                <g key={originalIndex}>
                  {/* Background Arc */}
                  <path
                    d={backGroundArcPath}
                    fill="none"
                    stroke={values.arcBackgroundColor}
                    strokeWidth={lineWidth}
                    className="transition-all duration-300"
                  />

                  {/* Visible arc with hover interaction */}
                  <path
                    d={foregroundArcPath}
                    fill="none"
                    stroke={values.arcColor}
                    strokeWidth={lineWidth}
                    strokeLinecap={lineCap === 'square' ? 'butt' : 'round'}
                    onMouseEnter={() => setHoveredIndex(originalIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      pointerEvents: 'stroke',
                    }}
                  />
                </g>
              );
            })}

            {/* Central text */}
            <text
              x="0"
              y="0"
              fill={
                hoveredIndex !== null
                  ? barValues[hoveredIndex]?.arcColor
                  : '#374151'
              }
              textAnchor="middle"
              dominantBaseline="central"
              className="text-2xl font-bold transition-all duration-300"
            >
              {hoveredIndex !== null
                ? barValues[hoveredIndex]?.value
                : totalBarValue}
              {hoveredIndex !== null
                ? `GB${barValues[hoveredIndex]?.barLabel}`
                : `GB${labelHeading}`}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  return;
};

export default RadialChart;
