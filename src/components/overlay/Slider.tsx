import * as React from "react";
import { SFC, ReactChild } from "react";
import MuiSlider from "@material-ui/lab/Slider";
import styled from "styled-components";

interface ISliderProps {
  children: ReactChild;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: number) => void;
}

const StyledSlider = styled(MuiSlider)`
    padding: 22px 0;
`;

const Slider: SFC<ISliderProps> = ({ children, onChange, value }) => (
  <React.Fragment>
    {children}
    <StyledSlider min={-3} max={3} step={1} value={value} onChange={onChange} />
  </React.Fragment>
);

export default Slider;
