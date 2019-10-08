import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDial from "@material-ui/lab/SpeedDial";
import React, {useState} from "react";
import StopWatch from '@material-ui/icons/Timer';
import {makeStyles} from '@material-ui/core/styles';
import uuid from 'uuid/v4';
import {startTimedActivity} from "../actions/ActivityActions";
import {connect} from "react-redux";
import {ActivityTimedType, ActivityType} from "../types/ActivityModels";
import {selectConfigurationState, selectTacticalActivityState, selectTacticalState} from "../reducers";
import {NOT_ASKED} from "../types/ConfigurationModels";
import {receivedNotificationPermission} from "../actions/ConfigurationActions";
import IconButton from "@material-ui/core/IconButton";
import {Cancel, KeyboardArrowDown} from "@material-ui/icons";
import {Grow} from "@material-ui/core";
import {objectToArray} from "../miscellanous/Tools";
import type {TacticalActivity} from "../types/TacticalModels";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import {TomatoIcon} from "./TomatoIcon";


const useStyles = makeStyles(theme => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  speedDial: {
    position: 'relative',
    top: theme.spacing(1),
    left: theme.spacing(1),
    margin: theme.spacing(1),
  },
  hubRoot: {
    position: 'absolute',
    top: theme.spacing(7),
  },
  container: {
    background: 'rgba(0,0,0,0.90)',
    position: 'fixed',
    top: '0',
    width: '100%',
    height: '100%',
    zIndex: '9001',
    overflow: 'auto',
  },
  toolTip: {
    zIndex: '9200',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  toolTipInner: {
    display: 'inline-block',
    fontSize: '1.5em',
  },
  contents: {
    top: '5%',
    height: '100%',
    position: 'relative',
  },
  icon: {
    fontSize: '4em',
  },
  cancel: {
    marginTop: theme.spacing(5),
  },
  cancelIcon: {
    fontSize: '1.25em',
    color: 'red',
    background: 'rgba(240, 0,0,0.25)',
    borderRadius: '50%',
  },
  bigIcon: {
    fontSize: "175px",
    padding: "25px",
    background: theme.palette.primary.main,
    borderRadius: '50%',
  },
  bigIconTomato: {
    padding: "30px",
    background: theme.palette.primary.main,
    borderRadius: '50%',
  },
  activityIcon: {},
  activityContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
}));

const ActivityHub = ({
                       dispatch: dispetch,
                       loadDuration,
                       notificationsAllowed,
                       activities,
                     }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [strategyOpen, setStrategyOpen] = useState(false);

  const commenceActivity = (name, supplements) =>
    dispetch(startTimedActivity({
      ...supplements,
      name,
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.STOP_WATCH,
      uuid: uuid(),
      workStartedWomboCombo: new Date().getTime(),
    }));

  const commenceTimedActivity = (name, supplements) => {
    if (notificationsAllowed === NOT_ASKED) {
      Notification.requestPermission()
        .then(res => dispetch(receivedNotificationPermission(res)));
    }
    return dispetch(startTimedActivity({
      ...supplements,
      name,
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.TIMER,
      duration: loadDuration,
      uuid: uuid(),
    }));
  };

  const commenceTimedObjectiveActivity = (activity: TacticalActivity) => {
    commenceTimedActivity(activity.name, {activityID: activity.id})
  };

  const commenceGenericTimedActivity = () => {
    commenceTimedActivity("GENERIC_TIMED_ACTIVITY", {})
  };

  const commenceObjectiveActivity = (activity: TacticalActivity) => {
    commenceActivity(activity.name, {activityID: activity.id})
  };

  const commenceGenericActivity = () => {
    commenceActivity("GENERIC_ACTIVITY", {})
  };

  const handleClick = () => setOpen(!open);

  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedGenericAction, setSelectedGenericAction] = useState(null);
  const invokeGenericAction = () => {
    selectedGenericAction();
    closeStrategy();
  };

  const [selectedIcon, setSelectedIcon] = useState(null);
  const baseAction = (action, icon, genericAction) => {
    setStrategyOpen(!strategyOpen);
    setSelectedAction(() => action);
    setSelectedGenericAction(() => genericAction);
    setSelectedIcon(icon)
  };

  const closeStrategy = () => {
    setStrategyOpen(false);
  };

  const actions = [
    {
      icon: <div style={{marginTop: 5}}>
        <TomatoIcon size={{width: 24, height: 24}}/>
      </div>,
      name: 'Start Timed Task', perform: () => baseAction(commenceTimedObjectiveActivity,
        (<div className={classes.bigIconTomato}>
          <TomatoIcon size={{width: 100, height: 100}}/>
        </div>),
        commenceGenericTimedActivity)
    },
    {
      icon: <StopWatch/>, name: 'Start Task', perform: () => baseAction(commenceObjectiveActivity,
        (<StopWatch className={classes.bigIcon}/>),
        commenceGenericActivity)
    },
  ];

  const [showToolTips, setShowTooltips] = useState(false);
  if (strategyOpen) {
    setTimeout(() => setShowTooltips(true), 250);
  } else if (showToolTips) {
    setShowTooltips(false)
  }

  return (
    <div className={classes.hubRoot}>
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        hidden={false}
        transitionDuration={0}
        icon={<SpeedDialIcon/>}
        onClick={handleClick}
        open={open}
        direction={"right"}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            tooltipPlacement={'bottom'}
            onClick={() => {
              handleClick();
              action.perform();
            }}
            title={""}
            children={<div/>}/>
        ))}
      </SpeedDial>
      <Grow in={strategyOpen}>
        <div className={classes.container}>
          <div className={classes.contents}>
            <IconButton
              className={classes.cancel}
              onClick={closeStrategy}
              color={'inherit'}>
              <Cancel className={classes.cancelIcon}/>
            </IconButton>
            <br/>
            <div className={classes.activityContainer}>
              {
                objectToArray(activities).map((activity: TacticalActivity) => (
                  <div key={`tip_${activity.id}`}>
                    <div className={classes.toolTip}>
                      <span className={classes.toolTipInner}>{activity.name}</span>
                      <KeyboardArrowDown style={{fontSize: '2em'}}/>
                    </div>
                    <IconButton color={'inherit'}
                                className={classes.activityIcon}
                                onClick={() => {
                                  selectedAction(activity);
                                  closeStrategy();
                                }}>
                      <TacticalActivityIcon tacticalActivity={activity} size={{
                        height: '150px',
                        width: '150px',
                      }}/>
                    </IconButton>
                  </div>
                ))
              }
            </div>
            <div className={classes.toolTip}>
              <span className={classes.toolTipInner}>Generic</span>
              <KeyboardArrowDown style={{fontSize: '2em'}}/>
            </div>
            <IconButton
              onClick={invokeGenericAction}
              color={'inherit'}>
              {selectedIcon}
            </IconButton>
          </div>
        </div>
      </Grow>
    </div>

  );
};

const mapStateToProps = state => {
  const {pomodoro: {settings: {loadDuration}}} = selectTacticalState(state);
  const {miscellaneous: {notificationsAllowed}} = selectConfigurationState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    loadDuration,
    notificationsAllowed,
    activities
  }
};

export default connect(mapStateToProps)(ActivityHub);
