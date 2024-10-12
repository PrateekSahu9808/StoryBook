import React, { useState } from 'react';
import './DonutChart.scss';

import { Status,DonutChartProps } from './type';

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

const useColorMappings = () => {
  return {
    colorMapping: {
      passed: '#016102',
      failed: '#C50303',
      warning: '#FF8B00',
      skipped: '#3C3838',
      default: '#610B86',
    },
    hoverMapping: {
      passed: '#C6EFCD',
      failed: '#F7D9D9',
      warning: '#FCD8AC',
      skipped: '#C4C3C3',
      default: '#ECEDF8',
    },
  };
};

const DonutChart: React.FC<DonutChartProps> = ({
  radius = 60,
  lineWidth = 15,
  statusValues = [],
  gapAngle = 0.06,
  legendDetailsType,
  isLegendEnabled=true
}) => {
  const [hoveredStatus, setHoveredStatus] = useState<Status | null>(null);
  const { colorMapping, hoverMapping } = useColorMappings();
  const total = statusValues.reduce((acc, status) => acc + status.value, 0);
  const nonZeroValues = statusValues.filter((value) => value.value > 0);

  // Calculate angles and gaps
  const totalGapAngle = gapAngle * nonZeroValues.length;
  let remainingAngle = 2 * Math.PI - totalGapAngle;
  let currentAngle = Math.PI / 2;

  const MIN_PERCENTAGE = 1;
  const MIN_ANGLE = (MIN_PERCENTAGE / 100) * (2 * Math.PI);
  let minAngleTotal = 0;

  // Fix small angles
  nonZeroValues.forEach(({ value }) => {
    const valuePercentage = value / total;
    let angle = valuePercentage * (2 * Math.PI);
    angle = Math.max(angle, MIN_ANGLE);
    minAngleTotal += angle;
    remainingAngle -= angle;
  });

  const handleMouseEnter = (status: Status) => {
    setHoveredStatus(status);
  };

  const handleMouseLeave = () => {
    setHoveredStatus(null);
  };

  const svgPadding = 4;
  const svgSize = (radius + lineWidth) * 2 + svgPadding * 2;
  return (
    <div className="ff-donut-chart-section">
      <div className="ff-donut-chart-svg-container">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          <g
            transform={`translate(${radius + lineWidth + svgPadding}, ${
              radius + lineWidth + svgPadding
            })`}
          >
            {nonZeroValues.map((status, i) => {
              const normalizedStatus = status.status.toLowerCase() as Status;
              const valuePercentage = status.value / total;
              let angle = valuePercentage * (2 * Math.PI);
              angle = Math.max(angle, MIN_ANGLE);
              angle += remainingAngle * (valuePercentage / (total / total));

              const endAngle = currentAngle + angle;

              const isFullCircle = nonZeroValues.length === 1;
              const foregroundArcPath = isFullCircle
                ? calculateArc(0, 0, radius, 0, 2 * Math.PI)
                : calculateArc(0, 0, radius, currentAngle, endAngle);

              // Outer arc independent of inner arc
              const outerArcRadius = radius + lineWidth - 2;
              const outerArcPath = isFullCircle
                ? calculateArc(0, 0, outerArcRadius, 0, 2 * Math.PI)
                : calculateArc(0, 0, outerArcRadius, currentAngle, endAngle);

              currentAngle = endAngle + gapAngle;
              return (
                <g key={i}>
                  {/* Main arc */}
                  <path
                    d={foregroundArcPath}
                    fill="none"
                    stroke={
                      colorMapping[
                        normalizedStatus as keyof typeof colorMapping
                      ]
                    }
                    strokeWidth={lineWidth} // Inner circle stroke width remains fixed
                    onMouseEnter={() => handleMouseEnter(normalizedStatus)}
                    onMouseLeave={handleMouseLeave}
                    strokeOpacity={0.8}
                  />

                  {/* Separate outer arc for hover effect */}
                  {hoveredStatus === normalizedStatus && (
                    <path
                      d={outerArcPath}
                      fill="none"
                      stroke={
                        colorMapping[
                          normalizedStatus as keyof typeof colorMapping
                        ]
                      }
                      strokeWidth={4}
                      strokeOpacity={0.3}
                    />
                  )}

                  <text
                    x="0"
                    y="-20"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {hoveredStatus ? hoveredStatus.toUpperCase() : 'TOTAL'}
                  </text>
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {hoveredStatus
                      ? `${
                          statusValues.find(
                            (s) =>
                              s.status.toLocaleLowerCase() === hoveredStatus
                          )?.value
                        } ${legendDetailsType}`
                      : `${total} ${legendDetailsType}`}
                  </text>
                  <rect
                    x={-16}
                    y={20}
                    width={32}
                    height={18}
                    fill={
                      hoveredStatus
                        ? hoverMapping[
                            hoveredStatus.toLowerCase() as keyof typeof hoverMapping
                          ]
                        : hoverMapping['default' as keyof typeof hoverMapping]
                    }
                    rx="5"
                    ry="5"
                  />

                  <text
                    x="0"
                    y="30"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={
                      hoveredStatus
                        ? colorMapping[
                            hoveredStatus.toLowerCase() as keyof typeof colorMapping
                          ]
                        : colorMapping['default' as keyof typeof colorMapping]
                    }
                  >
                    {hoveredStatus
                      ? `${Math.round(
                          ((statusValues.find(
                            (s) => s.status.toLowerCase() === hoveredStatus
                          )?.value || 0) /
                            total) *
                            100
                        )}%`
                      : '100%'}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      {isLegendEnabled &&<div className="ff-status-container">
        <div
          className={`ff-status-item ${
            hoveredStatus === null || hoveredStatus === 'passed'
              ? 'ff-highlighted'
              : 'ff-fade'
          }`}
        >
          <div className="ff-status-label">
            <div
              className="ff-status-color"
              style={{ backgroundColor: '#016102' } as React.CSSProperties}
            ></div>
            <div className="ff-status-text">Passed</div>
          </div>
          <div className="ff-status-details">
            <div className="ff-status-details-script-count">
              {`${Math.round(
                statusValues.find((s) => s.status.toLowerCase() === 'passed')
                  ?.value || 0
              )}`}
              <span>{legendDetailsType}</span>
            </div>
            <div className="ff-status-details-script-percentage">
              (
              {`${Math.round(
                ((statusValues.find((s) => s.status.toLowerCase() === 'passed')
                  ?.value || 0) /
                  total) *
                  100
              )}%`}
              )
            </div>
          </div>
        </div>
        <div
          className={`ff-status-item ${
            hoveredStatus === null || hoveredStatus === 'failed'
              ? 'ff-highlighted'
              : 'ff-fade'
          }`}
        >
          <div className="ff-status-label">
            <div
              className="ff-status-color"
              style={{ backgroundColor: '#c50303' } as React.CSSProperties}
            ></div>
            <div className="ff-status-text">Failed</div>
          </div>
          <div className="ff-status-details">
            <div className="ff-status-details-script-count">
              {`${Math.round(
                statusValues.find((s) => s.status.toLowerCase() === 'failed')
                  ?.value || 0
              )}`}
              <span>{legendDetailsType}</span>
            </div>
            <div className="ff-status-details-script-percentage">
              (
              {`${Math.round(
                ((statusValues.find((s) => s.status.toLowerCase() === 'failed')
                  ?.value || 0) /
                  total) *
                  100
              )}%`}
              )
            </div>
          </div>
        </div>
        <div
          className={`ff-status-item ${
            hoveredStatus === null || hoveredStatus === 'warning'
              ? 'ff-highlighted'
              : 'ff-fade'
          }`}
        >
          <div className="ff-status-label">
            <div
              className="ff-status-color"
              style={{ backgroundColor: '#ff8b00' } as React.CSSProperties}
            ></div>
            <div className="ff-status-text">Warning</div>
          </div>
          <div className="ff-status-details">
            <div className="ff-status-details-script-count">
              {`${Math.round(
                statusValues.find((s) => s.status.toLowerCase() === 'warning')
                  ?.value || 0
              )}`}
              <span>{legendDetailsType}</span>
            </div>
            <div className="ff-status-details-script-percentage">
              (
              {`${Math.round(
                ((statusValues.find((s) => s.status.toLowerCase() === 'warning')
                  ?.value || 0) /
                  total) *
                  100
              )}%`}
              )
            </div>
          </div>
        </div>
        <div
          className={`ff-status-item ${
            hoveredStatus === null || hoveredStatus === 'skipped'
              ? 'ff-highlighted'
              : 'ff-fade'
          }`}
        >
          <div className="ff-status-label">
            <div
              className="ff-status-color"
              style={{ backgroundColor: '#3c3838' } as React.CSSProperties}
            ></div>
            <div className="ff-status-text">Skipped</div>
          </div>
          <div className="ff-status-details">
            <div className="ff-status-details-script-count">
              {`${Math.round(
                statusValues.find((s) => s.status.toLowerCase() === 'skipped')
                  ?.value || 0
              )}`}
              <span>{legendDetailsType}</span>
            </div>
            <div className="ff-status-details-script-percentage">
              (
              {`${Math.round(
                ((statusValues.find((s) => s.status.toLowerCase() === 'skipped')
                  ?.value || 0) /
                  total) *
                  100
              )}%`}
              )
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default DonutChart;
