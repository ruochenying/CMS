import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { Statistic } from "../../lib/model";

export interface PieChartProps<T = Statistic> {
  data: T[];
  title: string;
}

const PieChart = ({ data, title }: PieChartProps) => {
  const [options, setOptions] = useState<any>({
    chart: {
      type: "pie",
    },
    title: {
      text: title,
    },
    tooltip: {
      pointFormat:
        "{series.name}: <b>{point.percentage:.1f}%</b><br/>total: {point.y}",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },

    credits: {
      enabled: false,
    },
  });
  useEffect(() => {
    if (!data) {
      return;
    }
    const source = data.map((item) => ({ name: item.name, y: item.amount }));

    setOptions({
      subtitle: {
        text: `${title.split(" ")[0]} total: ${source.reduce(
          (acc, cur) => acc + cur.y,
          0
        )}`,
        align: "right",
      },
      series: [
        {
          name: "percentage",
          colorByPoint: true,
          data: source,
        },
      ],
    });
  }, [data, title]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
