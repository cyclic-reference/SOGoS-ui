import * as React from 'react';
import {useState} from 'react';
import {SketchPicker} from "react-color";
import Save from '@material-ui/icons/Save';
import Cancel from '@material-ui/icons/Cancel';
import Edit from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import {Fade} from "@material-ui/core";
import Popper from "@material-ui/core/Popper";

export const ColorPicker = ({onSelect, onComplete}) => {
  const [open, setOpen] = useState(false);
  const [ancorElement, setAnchorElement] = useState(null);
  const [currentColor, setCurrentColor] = useState({
    hex: '#86a4f3',
    opacity: 1,
  });

  const [savedColor, setSetSavedColor] = useState({
    hex: '#86a4f3',
    opacity: 1,
  });
  const edit = (e) => {
    setAnchorElement(e.currentTarget);
    setSetSavedColor(currentColor);
    setOpen(true);
  };
  return (
    <div>
      <IconButton color={'inherit'} onClick={edit} hidden={open}>
        <Edit/>
      </IconButton>
      <Popper open={open}
              placement={'bottom'}
              anchorEl={ancorElement} transition>
        {({TransitionProps}) => (
          <Fade {...TransitionProps}>
            <div>
              <SketchPicker
                color={currentColor.hex}
                onChangeComplete={(color) => {
                  const brandNewColour = {
                    hex: color.hex,
                    opacity: color.rgb.a
                  };
                  setCurrentColor(brandNewColour);
                  onSelect(brandNewColour);
                }}/>
              <IconButton color={'inherit'} onClick={()=>{
                setOpen(false);
                onSelect(currentColor)
              }}>
                <Save/>
              </IconButton>
              <IconButton color={'inherit'} onClick={()=>{
                setOpen(false);
                onSelect(savedColor)
              }}>
                <Cancel/>
              </IconButton>
            </div>
          </Fade>
        )
        }
      </Popper>

    </div>
  );
};