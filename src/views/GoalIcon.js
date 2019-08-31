// @flow
import * as React from 'react';
import type {Objective} from "../types/StrategyModels";
import {MountainIcon} from "./MountainIcon";

type GoalProps = {
  objective: Objective
}
export const GoalIcon = ({objective}: GoalProps) => {
  const iconCustomization = objective.iconCustomization;
  const skyColor = (iconCustomization && iconCustomization.background) || {
    hex: '#86a4f3',
    opacity: 1,
  };
  return (
    <div>
      <MountainIcon skyColor={skyColor}/>
    </div>
  );
};