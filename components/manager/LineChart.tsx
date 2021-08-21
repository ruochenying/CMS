import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { Statistic } from "../../lib/model";

export interface LineChartProps {
  data: {
    [key: string]: Statistic[];
  };
}

const LineChart = ({ data }: LineChartProps) => {
  const [options, setOptions] = useState<any>({
    title: {
      text: "",
    },
    yAxis: {
      title: {
        text: "Increment",
      },
    },
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    tooltip: {
      shared: true,
    },

    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    const series = Object.entries(data)
      .filter(([_, data]) => !!data && !!data.length)
      .map(([key, value]) => {
        const arr = new Array(12).fill(0).map((_, index) => {
          const target = value.find(
            (item) => +item.name.split("-")[1] === index
          );
          return (target && target.amount) || 0;
        });
        return { name: key, data: arr };
      });
    setOptions({
      series,
    });
  }, [data]);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    ></HighchartsReact>
  );
};

export default LineChart;
