import React, {useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import {connect} from 'react-redux';
import {max, select, scaleQuantile, tsv} from 'd3';
import {GlobalState} from '../../reducers';

const WeeklyHeatMap = () => {
  useEffect(() => {
    var margin = {top: 50, right: 0, bottom: 100, left: 30},
      width = 800 - margin.left - margin.right,
      height = 430 - margin.top - margin.bottom,
      gridSize = Math.floor(width / 24),
      legendElementWidth = gridSize * 2,
      buckets = 9,
      colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], // alternatively colorbrewer.YlGnBu[9]
      days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"],
      datasets = ["http://172.17.0.1:3000/data1.tsv"];

    var svg = select("#heatBoi").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dayLabels = svg.selectAll(".dayLabel")
      .data(days)
      .enter().append("text")
      .text(function (d) {
        return d;
      })
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * gridSize;
      })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", function (d, i) {
        return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
      });

    var timeLabels = svg.selectAll(".timeLabel")
      .data(times)
      .enter().append("text")
      .text(function (d) {
        return d;
      })
      .attr("x", function (d, i) {
        return i * gridSize;
      })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .attr("class", function (d, i) {
        return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
      });

    var heatmapChart = function(tsvFile: string) {
      tsv(
        tsvFile,
        d=>
          ({
            // @ts-ignore
            day: +d.day,
            // @ts-ignore
            hour: +d.hour,
            // @ts-ignore
            value: +d.value,
          })).then(data => {
          console.log(data)
          var colorScale = scaleQuantile()
            .domain([0, buckets - 1, max(data, function (d) { return d.value; })])
            // @ts-ignore
            .range(colors);

          // @ts-ignore
          var cards = svg.selectAll(".hour")
            .data(data, (d: any) => d.day + ':' + d.hour);

          cards.append("title");

          cards.enter().append("rect")
            .attr("x", function(d) { return (d.hour - 1) * gridSize; })
            .attr("y", function(d) { return (d.day - 1) * gridSize; })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0]);

          cards.transition().duration(1000)
            .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });

          cards.exit().remove();

          // @ts-ignore
          var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
            .attr("class", "legend");

          legend.append("rect")
            .attr("x", (d: number, i: number): number => legendElementWidth * i)
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", (d: number, i: number) => colors[i]);

          legend.append("text")
            .attr("class", "mono")
            .text((d: number) => "≥ " + Math.round(d))
            .attr("x", (d: number, i: number) => legendElementWidth * i)
            .attr("y", height + gridSize);

          legend.exit().remove();
      });
    };

    heatmapChart(datasets[0]);
  });


  return (
    <div>
      <Typography variant={'h2'}>Weekly Heatmap</Typography>
      <div id={'heatBoi'}/>
    </div>
  );
};

const mapStateToProps = (globalState: GlobalState) => {
  return {};
};

export default connect(mapStateToProps)(WeeklyHeatMap);

// heatmap will show one/more activity.
