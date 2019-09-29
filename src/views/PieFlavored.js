import * as React from 'react';
import {useEffect} from 'react';
import {select} from 'd3-selection';
import {arc, pie} from 'd3'
import {connect} from "react-redux";
import {selectHistoryState, selectTacticalActivityState} from "../reducers";
import type {Activity} from "../types/ActivityModels";
import {activitiesEqual, getActivityName} from "../types/ActivityModels";
import {objectToKeyValueArray} from "../miscellanous/Tools";
import {areDifferent, getActivityIdentifier, shouldTime} from "../miscellanous/Projection";
import type {TacticalActivity} from "../types/TacticalModels";
import {constructColorMappings} from "./TimeLine";

export const getMeaningFullName = (activityId, tacticalActivities) => {
  const tacticalActivity: TacticalActivity = tacticalActivities[activityId];
  return (tacticalActivity && tacticalActivity.name) || activityId
};

const PieFlavored = ({ activityFeed,
                       relativeToTime,
                       relativeFromTime,
                       tacticalActivities,
                       bottomActivity,
                     }) => {
  const activityProjection = activityFeed.reduceRight((accum, activity) => {
    if (accum.trackedTime < 0) {
      accum.trackedTime = activity.antecedenceTime < relativeFromTime ? relativeFromTime : activity.antecedenceTime
    }

    if (shouldTime(activity) && !accum.currentActivity.antecedenceTime) {
      accum.currentActivity = activity;
    } else if (areDifferent(accum.currentActivity, activity) && shouldTime(activity)) {
      // Different Type: Create workable chunk and start next activity.
      const currentActivity = accum.currentActivity;
      accum.currentActivity = activity;
      const adjustedAntecedenceTime = activity.antecedenceTime < relativeFromTime ? relativeFromTime : activity.antecedenceTime;
      const duration = adjustedAntecedenceTime - accum.trackedTime;
      accum.trackedTime = activity.antecedenceTime;
      const activityName = getActivityName(currentActivity);
      const activityIdentifier = getActivityIdentifier(currentActivity);
      if (!accum.activityBins[activityIdentifier]) {
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
  if (!bins[activityIdentifier]) {
    bins[activityIdentifier] = []
  }

  const activityName = getActivityName(activityProjection.currentActivity);
  const meow = new Date().getTime();
  const capTime = meow < relativeToTime ? meow : relativeToTime;
  const duration = capTime - activityProjection.trackedTime;
  bins[activityIdentifier].push({
    activityName,
    activityIdentifier,
    duration,
    spawn: activityProjection.currentActivity,
  });

  const bottomCapActivity: Activity = bottomActivity;
  const lastActivityInScope: Activity = activityFeed[activityFeed.length - 1];
  // console.log(lastActivityInScope, bottomCapActivity);
  if(!activitiesEqual(lastActivityInScope, bottomCapActivity) && lastActivityInScope){
    const bottomActivityIdentifier = getActivityIdentifier(bottomCapActivity);
    if (!bins[bottomActivityIdentifier]) {
      bins[bottomActivityIdentifier] = []
    }
    const bottomCapActivityName = getActivityName(bottomCapActivity);
    // console.log("relativeFromTime", relativeFromTime, "antecedence", bottomCapActivity.antecedenceTime, "dy", bottomCapActivity.antecedenceTime < relativeFromTime);
    const bottomTime = bottomCapActivity.antecedenceTime < relativeFromTime ?
      relativeFromTime :
      bottomCapActivity.antecedenceTime;
    const bottomDuration = lastActivityInScope.antecedenceTime - bottomTime;
    bins[bottomActivityIdentifier].push({
      activityName: bottomCapActivityName,
      activityIdentifier: bottomActivityIdentifier,
      duration: bottomDuration,
      spawn: bottomActivity,
    });
    console.log(bottomCapActivityName);
    console.log(getActivityName(activityFeed[activityFeed.length - 1]));
  }
  

  const pieData = objectToKeyValueArray(bins)
    .reduce((accum, keyValue) => {
      accum.push({
        name: keyValue.key,
        value: keyValue.value.reduce((accum, binBoi) => accum + binBoi.duration, 0)
      });
      return accum;
    }, []);

  // console.log(pieData);

  useEffect(() => {
    if (activityFeed.length > 0) {
      const selection = select('#pieBoi');
      const width = 200;
      const height = 200;

      selection.select('svg').remove();

      const pieSVG = selection.append('svg')
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .style("height", '100%');

      const pieFlavored = pie()
        .padAngle(0.005)
        .sort(null)
        .value(d => d.value);

      const arcs = pieFlavored(pieData);

      const radius = Math.min(width, height) / 2;
      const arcThing = arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius - 1);

      const idToColor = constructColorMappings(tacticalActivities);

      pieSVG.selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => idToColor[d.data.name])
        .attr('opacity', 0.7)
        .attr('cursor', 'pointer')
        .attr("d", arcThing)
        .append("title")
        .text(d => `${getMeaningFullName(d.data.name, tacticalActivities)}: ${d.data.value.toLocaleString()}`);
    }
  });

  return (
    <div style={{
      height: '100%',
    }} id={'pieBoi'}>

    </div>
  );
};

const mapStateToProps = state => {
  const {activityFeed, selectedHistoryRange: {to, from}, capstone: {bottomActivity}} = selectHistoryState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    activityFeed,
    relativeToTime: to,
    relativeFromTime: from,
    tacticalActivities: activities,
    bottomActivity,
  }
};
export default connect(mapStateToProps)(PieFlavored);
