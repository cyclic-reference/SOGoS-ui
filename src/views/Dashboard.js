import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import {selectUserState} from "../reducers";
import {Card, Typography} from "@material-ui/core";
import {Reach} from "./Reach";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import {withRouter} from "react-router-dom";
import {StrategyIcon} from "./StrategyIcon";
import {TacticalIcon} from "./TacticalIcon";
import HistoryIcon from '@material-ui/icons/History';
import SettingsIcon from '@material-ui/icons/Settings';
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
  },
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
  placeIcon: {
    padding: theme.spacing(2)
  },
  gridItem: {
    padding: theme.spacing(1),
    width: theme.spacing(40),
  }
}));

const placesToGo = [
  {
    name: 'Strategy',
    description: 'What does it mean to succeed? Find your summit(s) here.',
    icon: <StrategyIcon/>,
    navigator: (history, guid) => () => history.push(`./strategy/`)
  },
  {
    name: 'Tactics',
    description: 'How do you get to the top of the summit? Figure out how scale mountains here.',
    icon: <TacticalIcon/>,
    navigator: (history, guid) => () => history.push(`./tactical/`)
  },
  {
    name: 'History',
    description: 'Look at how far you have come and all of your achievements!',
    icon: <HistoryIcon style={{fontSize: '100px'}}/>,
    navigator: (history, guid) => () => history.push(`./${guid}/history/`)
  },
  {
    name: 'Settings',
    description: 'Everybody is different. Tailor the experience to your abilities.',
    icon: <SettingsIcon style={{fontSize: '100px'}}/>,
    navigator: (history, guid) => () => history.push(`./settings/`)
  }
];

const Dashboard = ({
                     fullName,
                     guid,
                     history
                   }) => {
  const classes = useStyles();

  return (
    <LoggedInLayout>
      <div className={classes.headerContent}>
        <Container maxWidth={'sm'}>
          <Typography component={'h1'}
                      variant={'h2'}
                      align={'center'}
                      color={'textPrimary'}
                      gutterBottom>
            SOGoS
          </Typography>
          <Typography color={'textSecondary'}  gutterBottom>
            Strategic Orchestration and Governance System
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Welcome{fullName ? ` ${fullName}` : ''}!
            Figure out where you want to excel.
            Then push yourself to your limits.
            Knowing that you can find optimal recovery window for maximum periodization.
          </Typography>
          <Reach/>
        </Container>
      </div>
      <main className={classes.content}>
        <Grid container justify={'center'}>
          <Grid item>
            <Grid container
                  style={{flexGrow: 1}}
                  justify={'center'}
            >
              {
                placesToGo.map(placeToGo => (
                  <Grid item
                        xs={6}
                        className={classes.gridItem}
                        key={placeToGo.name}
                  >
                    <Card>
                      <CardActionArea onClick={placeToGo.navigator(history, guid)}>
                        <div className={classes.placeIcon}>
                          {placeToGo.icon}
                        </div>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {placeToGo.name}
                          </Typography>
                          <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                            {placeToGo.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))
              }
            </Grid>
          </Grid>
        </Grid>
      </main>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {information: {fullName, guid}} = selectUserState(state);
  return {
    fullName,
    guid
  }
};

export default connect(mapStateToProps)(withRouter(Dashboard));
