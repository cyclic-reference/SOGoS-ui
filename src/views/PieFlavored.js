import * as React from 'react';
import {useEffect, useState} from 'react';
import {select} from 'd3-selection';
import {arc, interpolateSpectral, pie, quantize, scaleOrdinal} from 'd3'
import {connect} from "react-redux";
import {selectHistoryState} from "../reducers";
import {
  getActivityName,
  getActivityObjectiveID,
  getActivityType,
  isActivityRecovery,
  RECOVERY
} from "../types/ActivityModels";
import type {Activity} from "../types/ActivityModels";
import {LOGGED_OFF, LOGGED_ON} from "../events/SecurityEvents";

const getActivityIdentifier = currentActivity => isActivityRecovery(currentActivity) ? RECOVERY : getActivityObjectiveID(currentActivity);

const PieFlavored = ({activityFeed}) => {
  const [didMountState] = useState('');
  const areDifferent = (currentActivity, nextActivity) => true;
  const shouldTime = (activity: Activity) => {
    const activityName = getActivityName(activity);
    switch (activityName) {
      case LOGGED_ON:
      case LOGGED_OFF:
        return false;
      default:
        return true;

    }
  };
  const activityProjection = activityFeed.reduceRight((accum, activity)=> {
    if(accum.trackedTime < 0){
      accum.trackedTime = activity.antecedenceTime
    }

    if(shouldTime(activity) && !accum.currentActivity.antecedenceTime) {
      accum.currentActivity = activity;
    } else if(areDifferent(accum.currentActivity, activity) && shouldTime(activity)) {
      // Different Type: Create workable chunk and start next activity.
      const currentActivity = accum.currentActivity;
      accum.currentActivity = activity;
      const duration = activity.antecedenceTime - accum.trackedTime ;
      accum.trackedTime = activity.antecedenceTime;
      const activityName = getActivityName(currentActivity);
      const activityIdentifier = getActivityIdentifier(currentActivity);
      if(!accum.activityBins[activityIdentifier]){
        accum.activityBins[activityIdentifier] = [];
      }
      accum.activityBins[activityIdentifier].push({
        activityName,
        activityIdentifier,
        duration,
        spawn: currentActivity,
      });
    }
    return accum;
  }, {
    trackedTime: -1,
    currentActivity: {},
    activityBins: {}
  });

  const bins = activityProjection.activityBins;
  const activityIdentifier = getActivityIdentifier(activityProjection.currentActivity);
  if(!bins[activityIdentifier]){
    bins[activityIdentifier] = []
  }
  const activityName = getActivityName(activityProjection.currentActivity);
  const meow = new Date().getTime();
  const duration = meow - activityProjection.trackedTime;
  bins[activityIdentifier].push({
    activityName,
    activityIdentifier,
    duration,
    spawn: activityProjection.currentActivity,
  });

  console.log(bins);


  useEffect(() => {


    const selection = select('#pieBoi');
    const width = 200;
    const height = 200;

    const pieSVG = selection.append('svg')
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("height", '100%');
    const pieFlavored = pie()
      .padAngle(0.005)
      .sort(null)
      .value(d => d.value);

    const arcs = pieFlavored(pieData);
    const color = scaleOrdinal()
      .domain(pieData.map(d => d.value))
      .range(quantize(t => interpolateSpectral(t * 0.8 + 0.1), pieData.length).reverse());

    const radius = Math.min(width, height) / 2;
    const arcThing = arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

    pieSVG.selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", d => color(d.data.value))
      .attr("d", arcThing)
      .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    pieSVG.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => `translate(${arcThing.centroid(d)})`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString()));
  }, [didMountState]);

  return (
    <div style={{
      height: '100%',
    }} id={'pieBoi'}>

    </div>
  );
};

const pieData = [
  {
    "id": "c",
    "label": "c",
    "value": 412,
    "color": "hsl(30, 70%, 50%)"
  },
  {
    "id": "python",
    "label": "python",
    "value": 260,
    "color": "hsl(148, 70%, 50%)"
  },
  {
    "id": "make",
    "label": "make",
    "value": 324,
    "color": "hsl(353, 70%, 50%)"
  },
  {
    "id": "css",
    "label": "css",
    "value": 489,
    "color": "hsl(135, 70%, 50%)"
  },
  {
    "id": "go",
    "label": "go",
    "value": 496,
    "color": "hsl(299, 70%, 50%)"
  }
];
const mapStateToProps = state => {
  const {activityFeed} = selectHistoryState(state);
  return {
    activityFeed
  }
};
export default connect(mapStateToProps)(PieFlavored);