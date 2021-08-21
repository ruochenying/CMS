import { add } from "date-fns/esm";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { Statistic } from "../../lib/model";
import { uniq } from "lodash";
import Item from "antd/lib/list/Item";
import { SkillDes } from "../../lib/constant/config";

export interface BarChartProps {
  data: {
    studentInterest: Statistic[];
    teacherSkills: Statistic[];
  };
}

const BarChart = ({ data }: BarChartProps) => {
  const { studentInterest, teacherSkills } = data;

  const [options, setOptions] = useState<any>({
    chart: {
      type: "column",
    },
    title: {
      text: "Student VS Teacher",
    },
    subtitle: {
      text: "Comparing what students are interested in and teachers’ skills",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Interested VS Skills",
      },
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        return this.series.name === "Interest"
          ? `${this.series.name}: ${this.y}`
          : `<b>${this.x}</b><br/>${this.series.name}: ${this.y}<br/>total: ${this.point.stackTotal}`;
      },
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
        },
      },
    },
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data || Object.values(data).some((item) => !item)) {
      return;
    }

    const categories = [
      ...new Set([
        ...studentInterest?.map((item) => item.name),
        ...Object.keys(teacherSkills),
      ]),
    ];
    const studentInterestData = categories.map((category) => {
      const target = studentInterest.find((item) => item.name === category);
      return target ? target.amount : 0;
    });

    const levels = uniq(
      Object.values(teacherSkills)
        .flat()
        .map((item) => item.level)
    ).sort();

    const teacherSkillsData = levels.map((level) => {
      return {
        name: SkillDes[level],
        data: categories.map((category) => {
          const target = teacherSkills[category]?.find(
            (item) => item.level === level
          );
          return target ? target.amount : 0;
        }),
        stack: "teacher",
      };
    });

    setOptions({
      xAxis: {
        type: "category",
        labels: {
          rotation: -45,
          style: {
            fontSize: "13px",
            fontFamily: "Verdana, sans-serif",
          },
        },
        categories: categories,
      },
      series: [
        ...teacherSkillsData,
        {
          name: "Interest",
          data: studentInterestData,
        },
      ],
    });
  }, [data, studentInterest, teacherSkills]);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    ></HighchartsReact>
  );
};

export default BarChart;
