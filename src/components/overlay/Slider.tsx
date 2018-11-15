import * as React from "react";
import { SFC, ReactChild } from "react";
import MuiSlider from "@material-ui/lab/Slider";

const Slider : SFC<{children: ReactChild}> = ({children}) => (
    <React.Fragment>
        {children}
        <MuiSlider value={0} min={-3} max={3} step={1} />
    </React.Fragment>
)

export default Slider;