---
title: Chart
slug: chart
weight: 2050
date: 2026-01-17T10:40:00+08:00
tags: ["chart", "echarts", "visualization", "shortcodes"]
description: "Learn how to use the chart shortcode to embed various interactive data visualizations using Apache ECharts, including line, pie, scatter, and boxplot charts."
series: ["Shortcodes"]
---

## Chart

`chart` uses the [Apache ECharts](https://echarts.apache.org/en/index.html) to embed charts into articles. It supports a vast range of [official examples](https://echarts.apache.org/examples/en/index.html).

> [!Note]
>
> The `chart` shortcode places your code directly into a `<script>` tag. To ensure compatibility:
>
> - **Variable Naming**: The code must define an `option` variable as the configuration object.
> - **Extensions**: Extensions such as `ecStat`, `echarts-gl`, or `echarts-liquidfill` are not built-in. Examples requiring these will not function.
> - **Data Sources**: Examples using `fetch` or `$.get` require data sources that support CORS.

### Line Chart

[Basic Line Chart](https://echarts.apache.org/examples/en/editor.html?c=line-simple)

{{< chart >}}
option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
};
{{< /chart >}}

[Distribution of Electricity](https://echarts.apache.org/examples/en/editor.html?c=line-sections)

{{< chart >}}
option = {
  title: {
    text: 'Distribution of Electricity',
    subtext: 'Fake Data'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    // prettier-ignore
    data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} W'
    },
    axisPointer: {
      snap: true
    }
  },
  visualMap: {
    show: false,
    dimension: 0,
    pieces: [
      {
        lte: 6,
        color: 'green'
      },
      {
        gt: 6,
        lte: 8,
        color: 'red'
      },
      {
        gt: 8,
        lte: 14,
        color: 'green'
      },
      {
        gt: 14,
        lte: 17,
        color: 'red'
      },
      {
        gt: 17,
        color: 'green'
      }
    ]
  },
  series: [
    {
      name: 'Electricity',
      type: 'line',
      smooth: true,
      // prettier-ignore
      data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
      markArea: {
        itemStyle: {
          color: 'rgba(255, 173, 177, 0.4)'
        },
        data: [
          [
            {
              name: 'Morning Peak',
              xAxis: '07:30'
            },
            {
              xAxis: '10:00'
            }
          ],
          [
            {
              name: 'Evening Peak',
              xAxis: '17:30'
            },
            {
              xAxis: '21:15'
            }
          ]
        ]
      }
    }
  ]
};
{{< /chart >}}

### Pie Chart

[Referer of a Website](https://echarts.apache.org/examples/en/editor.html?c=pie-simple)

{{< chart >}}
option = {
  title: {
    text: 'Referer of a Website',
    subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};
{{< /chart >}}

### Scatter

[Basic Scatter Chart](https://echarts.apache.org/examples/en/editor.html?c=scatter-simple)

{{< chart >}}
option = {
  xAxis: {},
  yAxis: {},
  series: [
    {
      symbolSize: 20,
      data: [
        [10.0, 8.04],
        [8.07, 6.95],
        [13.0, 7.58],
        [9.05, 8.81],
        [11.0, 8.33],
        [14.0, 7.66],
        [13.4, 6.81],
        [10.0, 6.33],
        [14.0, 8.96],
        [12.5, 6.82],
        [9.15, 7.2],
        [11.5, 7.2],
        [3.03, 4.23],
        [12.2, 7.83],
        [2.02, 4.47],
        [1.05, 3.33],
        [4.05, 4.96],
        [6.03, 7.24],
        [12.0, 6.26],
        [12.0, 8.84],
        [7.08, 5.82],
        [5.02, 5.68]
      ],
      type: 'scatter'
    }
  ]
};
{{< /chart >}}

[Bubble Chart](https://echarts.apache.org/examples/en/editor.html?c=bubble-gradient)

{{< chart >}}
const data = [
  [
    [28604, 77, 17096869, 'Australia', 1990],
    [31163, 77.4, 27662440, 'Canada', 1990],
    [1516, 68, 1154605773, 'China', 1990],
    [13670, 74.7, 10582082, 'Cuba', 1990],
    [28599, 75, 4986705, 'Finland', 1990],
    [29476, 77.1, 56943299, 'France', 1990],
    [31476, 75.4, 78958237, 'Germany', 1990],
    [28666, 78.1, 254830, 'Iceland', 1990],
    [1777, 57.7, 870601776, 'India', 1990],
    [29550, 79.1, 122249285, 'Japan', 1990],
    [2076, 67.9, 20194354, 'North Korea', 1990],
    [12087, 72, 42972254, 'South Korea', 1990],
    [24021, 75.4, 3397534, 'New Zealand', 1990],
    [43296, 76.8, 4240375, 'Norway', 1990],
    [10088, 70.8, 38195258, 'Poland', 1990],
    [19349, 69.6, 147568552, 'Russia', 1990],
    [10670, 67.3, 53994605, 'Turkey', 1990],
    [26424, 75.7, 57110117, 'United Kingdom', 1990],
    [37062, 75.4, 252847810, 'United States', 1990]
  ],
  [
    [44056, 81.8, 23968973, 'Australia', 2015],
    [43294, 81.7, 35939927, 'Canada', 2015],
    [13334, 76.9, 1376048943, 'China', 2015],
    [21291, 78.5, 11389562, 'Cuba', 2015],
    [38923, 80.8, 5503457, 'Finland', 2015],
    [37599, 81.9, 64395345, 'France', 2015],
    [44053, 81.1, 80688545, 'Germany', 2015],
    [42182, 82.8, 329425, 'Iceland', 2015],
    [5903, 66.8, 1311050527, 'India', 2015],
    [36162, 83.5, 126573481, 'Japan', 2015],
    [1390, 71.4, 25155317, 'North Korea', 2015],
    [34644, 80.7, 50293439, 'South Korea', 2015],
    [34186, 80.6, 4528526, 'New Zealand', 2015],
    [64304, 81.6, 5210967, 'Norway', 2015],
    [24787, 77.3, 38611794, 'Poland', 2015],
    [23038, 73.13, 143456918, 'Russia', 2015],
    [19360, 76.5, 78665830, 'Turkey', 2015],
    [38225, 81.4, 64715810, 'United Kingdom', 2015],
    [53354, 79.1, 321773631, 'United States', 2015]
  ]
];
option = {
  backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
    {
      offset: 0,
      color: '#f7f8fa'
    },
    {
      offset: 1,
      color: '#cdd0d5'
    }
  ]),
  title: {
    text: 'Life Expectancy and GDP by Country',
    left: '5%',
    top: '3%'
  },
  legend: {
    right: '10%',
    top: '3%',
    data: ['1990', '2015']
  },
  grid: {
    left: '8%',
    top: '10%'
  },
  xAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  yAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    scale: true
  },
  series: [
    {
      name: '1990',
      data: data[0],
      type: 'scatter',
      symbolSize: function (data) {
        return Math.sqrt(data[2]) / 5e2;
      },
      emphasis: {
        focus: 'series',
        label: {
          show: true,
          formatter: function (param) {
            return param.data[3];
          },
          position: 'top'
        }
      },
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(120, 36, 50, 0.5)',
        shadowOffsetY: 5,
        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
          {
            offset: 0,
            color: 'rgb(251, 118, 123)'
          },
          {
            offset: 1,
            color: 'rgb(204, 46, 72)'
          }
        ])
      }
    },
    {
      name: '2015',
      data: data[1],
      type: 'scatter',
      symbolSize: function (data) {
        return Math.sqrt(data[2]) / 5e2;
      },
      emphasis: {
        focus: 'series',
        label: {
          show: true,
          formatter: function (param) {
            return param.data[3];
          },
          position: 'top'
        }
      },
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(25, 100, 150, 0.5)',
        shadowOffsetY: 5,
        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
          {
            offset: 0,
            color: 'rgb(129, 227, 238)'
          },
          {
            offset: 1,
            color: 'rgb(25, 183, 207)'
          }
        ])
      }
    }
  ]
};
{{< /chart >}}

### Boxplot

[Boxplot Light Velocity](https://echarts.apache.org/examples/en/editor.html?c=boxplot-light-velocity)

{{< chart >}}
option = {
  title: [
    {
      text: 'Michelson-Morley Experiment',
      left: 'center'
    },
    {
      text: 'upper: Q3 + 1.5 *IQR \nlower: Q1 - 1.5* IQR',
      borderColor: '#999',
      borderWidth: 1,
      textStyle: {
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 20
      },
      left: '10%',
      top: '90%'
    }
  ],
  dataset: [
    {
      // prettier-ignore
      source: [
                [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
                [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
                [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
                [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
                [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
            ]
    },
    {
      transform: {
        type: 'boxplot',
        config: { itemNameFormatter: 'expr {value}' }
      }
    },
    {
      fromDatasetIndex: 1,
      fromTransformResult: 1
    }
  ],
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%'
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    nameGap: 30,
    splitArea: {
      show: false
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    name: 'km/s minus 299,000',
    splitArea: {
      show: true
    }
  },
  series: [
    {
      name: 'boxplot',
      type: 'boxplot',
      datasetIndex: 1
    },
    {
      name: 'outlier',
      type: 'scatter',
      datasetIndex: 2
    }
  ]
};
{{< /chart >}}
