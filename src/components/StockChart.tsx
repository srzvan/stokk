import * as React from 'react';
import { max, extent } from 'd3-array';
import { localPoint } from '@visx/event';
import { curveMonotoneX } from '@visx/curve';
import { Box, theme } from '@chakra-ui/react';
import { LinearGradient } from '@visx/gradient';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AreaClosed, Line, Bar, LinePath } from '@visx/shape';
import { useTooltip, Tooltip, defaultStyles } from '@visx/tooltip';

import {
  getDate,
  bisectDate,
  formatDate,
  getStockHighValue,
  getStockAverageValue,
  NormalizedTimeSeries,
  NormalizedTimeSeriesItem,
} from '../utils/daily-stock-time-series';

interface AreaProps {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

interface StockChartProps extends AreaProps {
  showAverage: boolean;
  stockTimeSeries: NormalizedTimeSeries;
}

const styles = {
  accent: {
    dark: '#75daad',
    light: '#edffea',
  },
  background: {
    dark: '#3b6978',
    darker: '#204051',
  },
};

const tooltipHighStyles = {
  ...defaultStyles,
  color: 'white',
  border: '1px solid white',
  background: styles.background.dark,
};

const tooltipAverageStyles = {
  ...tooltipHighStyles,
  background: theme.colors.orange[500],
};

export const StockChart: React.FC<StockChartProps> = ({
  width,
  height,
  margin,
  showAverage,
  stockTimeSeries,
}) => {
  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } =
    useTooltip<NormalizedTimeSeriesItem>();

  const xMax = margin ? width - margin.left - margin.right : width;
  const yMax = margin ? height - margin.top - margin.bottom : height;

  const dateScale = React.useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(stockTimeSeries, getDate) as [Date, Date],
      }),
    [xMax, stockTimeSeries]
  );

  const stockValueScale = React.useMemo(
    () =>
      scaleLinear({
        nice: true,
        range: [yMax, 0],
        domain: [0, (max(stockTimeSeries, getStockHighValue) || 0) + yMax / 3],
      }),
    [yMax, stockTimeSeries]
  );

  const handleTooltip = React.useCallback(
    (event: React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(stockTimeSeries, x0, 1);
      const d0 = stockTimeSeries[index - 1];
      const d1 = stockTimeSeries[index];
      let d = d0;

      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }

      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: stockValueScale(getStockHighValue(d)),
      });
    },
    [showTooltip, stockValueScale, dateScale, stockTimeSeries]
  );

  return (
    <Box position="relative">
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          rx={14}
          width={width}
          height={height}
          fill="url(#area-background-gradient)"
        />
        <LinearGradient
          id="area-background-gradient"
          from={styles.background.dark}
          to={styles.background.darker}
        />
        <LinearGradient
          toOpacity={0.1}
          id="area-gradient"
          to={styles.accent.light}
          from={styles.accent.light}
        />
        <GridRows
          width={xMax}
          strokeOpacity={0.3}
          pointerEvents="none"
          strokeDasharray="3,3"
          scale={stockValueScale}
          stroke={styles.accent.light}
        />
        <GridColumns
          height={yMax}
          scale={dateScale}
          strokeOpacity={0.3}
          pointerEvents="none"
          strokeDasharray="3,3"
          stroke={styles.accent.light}
        />
        <AreaClosed<NormalizedTimeSeriesItem>
          strokeWidth={1}
          data={stockTimeSeries}
          curve={curveMonotoneX}
          yScale={stockValueScale}
          fill="url(#area-gradient)"
          stroke="url(#area-gradient)"
          x={(d) => dateScale(getDate(d))}
          y={(d) => stockValueScale(getStockHighValue(d))}
        />
        {showAverage && (
          <LinePath
            strokeWidth={1.5}
            data={stockTimeSeries}
            curve={curveMonotoneX}
            x={(d) => dateScale(getDate(d))}
            stroke={theme.colors.orange[500]}
            y={(d) => stockValueScale(getStockAverageValue(d))}
          />
        )}
        <Bar
          x={0}
          y={0}
          rx={14}
          width={width}
          height={height}
          fill="transparent"
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && tooltipTop && (
          <g>
            <Line
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
              stroke={styles.accent.dark}
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: yMax }}
            />
            <circle
              r={4}
              fill="black"
              stroke="black"
              strokeWidth={2}
              cx={tooltipLeft}
              fillOpacity={0.1}
              cy={tooltipTop + 1}
              strokeOpacity={0.1}
              pointerEvents="none"
            />
            <circle
              r={4}
              stroke="white"
              cy={tooltipTop}
              strokeWidth={2}
              cx={tooltipLeft}
              pointerEvents="none"
              fill={styles.accent.dark}
            />
          </g>
        )}
      </svg>
      {tooltipData && tooltipTop && tooltipLeft && (
        <div>
          <Tooltip
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipHighStyles}
          >
            {`$${getStockHighValue(tooltipData)}`}
          </Tooltip>
          {showAverage && (
            <Tooltip
              top={tooltipTop + 25}
              left={tooltipLeft + 12}
              style={tooltipAverageStyles}
            >
              Average: {`$${getStockAverageValue(tooltipData)}`}
            </Tooltip>
          )}
          <Tooltip
            top={yMax + 15}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: 'center',
              transform: 'translateX(-50%)',
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        </div>
      )}
    </Box>
  );
};
