import * as React from "react";
import { Box, theme } from "@chakra-ui/react";
import { LinearGradient } from "@visx/gradient";
import { scaleTime, scaleLinear } from "@visx/scale";
import { GridRows, GridColumns } from "@visx/grid";
import { AreaClosed, Line, Bar, LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import { max, extent } from "d3-array";

import {
  bisectDate,
  formatDate,
  getDate,
  getStockAverageValue,
  getStockHighValue,
  NormalizedTimeSeries,
  NormalizedTimeSeriesItem,
} from "../utils/daily-stock-time-series";

type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

type StockChartProps = {
  stockTimeSeries: NormalizedTimeSeries;
  showAverage: boolean;
} & AreaProps;

const styles = {
  accent: {
    light: "#edffea",
    dark: "#75daad",
  },
  background: {
    dark: "#3b6978",
    darker: "#204051",
  },
};

const tooltipHighStyles = {
  ...defaultStyles,
  background: styles.background.dark,
  border: "1px solid white",
  color: "white",
};

const tooltipAverageStyles = {
  ...tooltipHighStyles,
  background: theme.colors.orange[500],
};

function StockChart(props: StockChartProps) {
  const { stockTimeSeries, showAverage, width, height, margin } = props;

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } = useTooltip<NormalizedTimeSeriesItem>();

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
        range: [yMax, 0],
        domain: [0, max(stockTimeSeries, getStockHighValue) as number],
        nice: true,
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
        d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
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
        <rect x={0} y={0} width={width} height={height} fill="url(#area-background-gradient)" rx={14} />
        <LinearGradient id="area-background-gradient" from={styles.background.dark} to={styles.background.darker} />
        <LinearGradient id="area-gradient" from={styles.accent.light} to={styles.accent.light} toOpacity={0.1} />
        <GridRows
          scale={stockValueScale}
          width={xMax}
          strokeDasharray="3,3"
          stroke={styles.accent.light}
          strokeOpacity={0.3}
          pointerEvents="none"
        />
        <GridColumns
          scale={dateScale}
          height={yMax}
          strokeDasharray="3,3"
          stroke={styles.accent.light}
          strokeOpacity={0.3}
          pointerEvents="none"
        />
        <AreaClosed<NormalizedTimeSeriesItem>
          data={stockTimeSeries}
          x={d => dateScale(getDate(d))}
          y={d => stockValueScale(getStockHighValue(d))}
          yScale={stockValueScale}
          strokeWidth={1}
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />
        {showAverage && (
          <LinePath
            stroke={theme.colors.orange[500]}
            strokeWidth={1.5}
            data={stockTimeSeries}
            x={d => dateScale(getDate(d))}
            y={d => stockValueScale(getStockAverageValue(d))}
            curve={curveMonotoneX}
          />
        )}
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && tooltipTop && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: yMax }}
              stroke={styles.accent.dark}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={styles.accent.dark}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && tooltipTop && tooltipLeft && (
        <div>
          <Tooltip top={tooltipTop - 12} left={tooltipLeft + 12} style={tooltipHighStyles}>
            {`$${getStockHighValue(tooltipData)}`}
          </Tooltip>
          {showAverage && (
            <Tooltip top={tooltipTop + 25} left={tooltipLeft + 12} style={tooltipAverageStyles}>
              Average: {`$${getStockAverageValue(tooltipData)}`}
            </Tooltip>
          )}
          <Tooltip
            top={yMax + 15}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: "center",
              transform: "translateX(-50%)",
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        </div>
      )}
    </Box>
  );
}

export default StockChart;
