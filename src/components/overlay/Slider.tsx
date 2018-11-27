import * as React from "react";
import { SFC, ReactChild } from "react";
import MuiSlider from "@material-ui/lab/Slider";
import { withStyles } from "@material-ui/core/styles";

interface ISliderProps {
  children: ReactChild;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: number) => void;
}

const StyledSlider = withStyles({
  root: {
    padding: "22px 0"
  }
})(MuiSlider);

const Slider: SFC<ISliderProps> = ({ children, onChange, value }) => (
  <React.Fragment>
    {children}
    <StyledSlider min={-3} max={3} step={1} value={value} onChange={onChange} />
  </React.Fragment>
);

export default Slider;
