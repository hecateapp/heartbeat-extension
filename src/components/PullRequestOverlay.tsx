import * as React from "react";
import { inject, observer } from "mobx-react";

import { logView } from "../util/api";
import PullRequestStore from "../stores/PullRequestStore";
import { BackgroundRatingMessage } from "../util/types";
import { SFC } from "react";

interface IPullRequestOverlayProps {
  pullRequestStore?: PullRequestStore;
  prPath: string;
}

const RatingRadioButton: SFC<{
  value: number;
  rating: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, rating, onChange }) => (
  <input
    type="radio"
    name="rating"
    value={value}
    checked={value === rating}
    onChange={onChange}
  />
);

class PullRequestOverlay extends React.Component<IPullRequestOverlayProps> {
  componentDidMount() {
    this.props.pullRequestStore && this.props.pullRequestStore.loadRating(this.props.prPath);
  }

  handleRating(e: React.ChangeEvent<HTMLInputElement>) {
    const rating = parseInt(e.target.value, 10);
    console.log(rating);
    if (rating !== this.props.pullRequestStore.rating) {
      this.props.pullRequestStore &&
        this.props.pullRequestStore.setRating(rating);
    }
  }

  render() {
    if (!this.props.pullRequestStore) {
      return <p>Loading...</p>;
    }

    return (
      <div style={{ backgroundColor: "grey", border: "solid 2px red" }}>
        <h3>💓🥁</h3>
        <div>
          😠
          <RatingRadioButton
            value={1}
            rating={this.props.pullRequestStore.rating}
            onChange={this.handleRating.bind(this)}
          />
        </div>
        <div>
          😔
          <RatingRadioButton
            value={2}
            rating={this.props.pullRequestStore.rating}
            onChange={this.handleRating.bind(this)}
          />
        </div>
        <div>
          😑
          <RatingRadioButton
            value={3}
            rating={this.props.pullRequestStore.rating}
            onChange={this.handleRating.bind(this)}
          />
        </div>
        <div>
          🙂
          <RatingRadioButton
            value={4}
            rating={this.props.pullRequestStore.rating}
            onChange={this.handleRating.bind(this)}
          />
        </div>
        <div>
          😍
          <RatingRadioButton
            value={5}
            rating={this.props.pullRequestStore.rating}
            onChange={this.handleRating.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default inject("pullRequestStore")(observer(PullRequestOverlay));
