import React from "react";

interface ISliderProps {
  value?: string;
  onChange: (event: React.ChangeEvent<Element>, value: string) => void;
}

interface ISliderState {
  percentage?: number;
  clicked: boolean;
}

class Slider extends React.Component<ISliderProps, ISliderState> {
  constructor(props: ISliderProps) {
    super(props);
    if (props.value) {
      this.state = {
        percentage: parseFloat(props.value) * 25 + 50,
        clicked: true
      };
    } else {
      this.state = {
        clicked: false
      };
    }
  }

  score(val?: number) {
    const percentage = val || this.state.percentage;
    if (percentage) {
      const shifted = percentage - 50;
      const clamped = shifted / 25;
      return clamped;
    }
  }

  render() {
    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
          overflow: "hidden",
          marginTop: "0.4em"
        }}
      >
        <div
          style={{
            pointerEvents: "none",
            position: "absolute",
            height: "100%",
            right: 0,
            backgroundColor: "white",
            opacity: 0.6,
            width: `${
              this.state.percentage ? 100 - this.state.percentage : 100
            }%`
          }}
        />
        <div
          style={{
            display: "inline-block",
            cursor: "pointer",
            fontSize: "1.8em"
          }}
          onMouseMove={this.mouseMove}
          onClick={this.lockItIn}
        >
          😬😒😐😊🤩
        </div>
      </div>
    );
  }

  percentage(e: any) {
    const boundingRect: DOMRect = e.target.getBoundingClientRect();
    const x = e.clientX - boundingRect.x;
    const width = boundingRect.width;

    const percentage = Math.max(
      0,
      Math.min(100, Math.round((x / width) * 100))
    );

    return percentage;
  }

  mouseMove = (e: any) => {
    if (this.state.clicked) {
      return;
    }

    const percentage = this.percentage(e);
    if (percentage !== this.state.percentage) {
      this.setState({ percentage });
    }
  };

  lockItIn = (e: any) => {
    const percentage = this.percentage(e);
    const value = this.score(percentage).toFixed(2);
    this.props.onChange(e, value);
    this.setState({ clicked: true, percentage });
  };
}

export default Slider;
