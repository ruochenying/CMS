import Highcharts from "highcharts";
import HighchartsMap from "highcharts/modules/map";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { getWorld } from "../../lib/services/api-service";
import { Statistic } from "../../lib/model";
export interface DistributionProps {
  data: Statistic[];
  title: string;
}

if (typeof Highcharts === "object") {
  HighchartsMap(Highcharts);
}
const Distribution = ({ data, title }: DistributionProps) => {
  const [world, setWorld] = useState<any>(null);
  const [options, setOptions] = useState<any>({});

  useEffect(() => {
    getWorld().then((resp) => {
      setWorld(resp.data);
      setOptions({
        series: [{ mapData: resp.data }],
      });
    });
  }, []);

  useEffect(() => {
    if (!data || !world) {
      return;
    }
    const mapSource = data.map((item) => {
      const target = world.features.find(
        (feature) =>
          item.name.toLowerCase() === feature.properties.name.toLowerCase()
      );

      return !!target
        ? {
            "hc-key": target.properties["hc-key"],
            value: item.amount,
          }
        : {};
    });
    setOptions({
      title: {
        text: title,
      },

      legend: {
        layout: "vertical",
        align: "left",
        verticalAlign: "bottom",
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      colorAxis: {
        min: 0,
        stops: [
          [0, "#fff"],
          [0.5, Highcharts.getOptions().colors[0]],
          [1, "#1890ff"],
        ],
      },
      series: [
        {
          data: mapSource,
          name: "Total",
          states: {
            hover: {
              color: "#a4edba",
            },
          },
        },
      ],
    });
  }, [data, title, world]);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType={"mapChart"}
    ></HighchartsReact>
  );
};

export default Distribution;
