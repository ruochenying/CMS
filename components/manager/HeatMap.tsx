import Highcharts from "highcharts";
import HighchartsHeatmap from "highcharts/modules/heatmap";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef, useState } from "react";
import { weekDays } from "../../lib/constant";
import { CourseClassTimeStatistic } from "../../lib/model";

export interface HeatMapProps {
  data: CourseClassTimeStatistic[];
}

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
  HighchartsHeatmap(Highcharts);
}

const countTotal = (arr: number[]) => {
  const counts = {};
  let result = [];
  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  result = Object.values(counts);
  return result.concat(result.reduce((acc, cur) => acc + cur));
};

const HeatMap = ({ data }: HeatMapProps) => {
  const [options, setOptions] = useState<any>({
    chart: {
      type: "heatmap",
      plotBorderWidth: 1,
      // margin: [30, 30, 30, 30],
    },
    title: {
      text: "Course Schedule Per Weekday",
    },
    credits: {
      enabled: false,
    },
    colorAxis: {
      min: 0,
      minColor: "#FFFFFF",
      maxColor: "#1890ff",
    },
    legend: {
      align: "right",
      layout: "vertical",
      margin: 0,
      verticalAlign: "top",
      y: 25,
      symbolHeight: 280,
    },
    tooltip: {
      formatter: function () {
        return `<b> ${this.series.yAxis.categories[this.point.y]}</b>
           <br/>
           <b>${this.point.value}</b> lessons on <b>${
          this.series.xAxis.categories[this.point.x]
        }</b>`;
      },
    },
  });

  const charRef = useRef(null);

  useEffect(() => {
    const { chart } = charRef.current;
    const timer = setTimeout(() => {
      chart.reflow();
    }, 30);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    const yCategories = [
      ...new Set(
        data
          .map((item) => item.courses)
          .map((item) => item.map((item) => item.typeName))
          .flat()
      ),
    ];
    const xCategories = weekDays.concat("Total");

    const courseTime = yCategories.map((category) => {
      return data
        .map((item) =>
          item.courses.map((item) => {
            if (item.typeName === category) {
              return item.classTime;
            }
          })
        )
        .flat()
        .filter((item) => item !== undefined && item !== null);
    });

    const weekdayCountAndTotal = courseTime.map((item) => {
      const arr = new Array(7).fill(0);
      const count = [];
      item.flat().map((item) => {
        const index = weekDays.findIndex(
          (weekday) => weekday === item.split(" ")[0]
        );
        arr[index] += 1;
        if (index >= 0) {
          count.push(index);
        }
      });

      return {
        weekdays: arr.concat(arr.reduce((acc, cur) => acc + cur)),
        count: count,
      };
    });

    const total = countTotal(
      weekdayCountAndTotal
        .map((item) => item.count)
        .flat()
        .sort()
    );

    const weekdayCount = weekdayCountAndTotal
      .map((item) => item.weekdays)
      .concat([total]);

    const sourceData = weekdayCount
      .map((item, y) => item.map((element, x) => [x, y, element]))
      .flat();

    setOptions({
      yAxis: {
        categories: yCategories.concat("total"),
        title: null,
        reversed: true,
      },
      xAxis: {
        categories: xCategories,
      },
      series: [
        {
          name: "Lessons per weekday",
          borderWidth: 1,
          data: sourceData,
          dataLabels: {
            enabled: true,
            color: "#000000",
          },
        },
      ],
    });
  }, [data]);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={charRef}
    ></HighchartsReact>
  );
};

export default HeatMap;
