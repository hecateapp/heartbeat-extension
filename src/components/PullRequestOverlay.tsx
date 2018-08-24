import * as React from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components";

import PullRequestStore from "../stores/PullRequestStore";

import RatingRadioButton from "./RatingRadioButton";
import TitlePanel from "./TitlePanel";

interface IPullRequestOverlayProps {
  pullRequestStore?: PullRequestStore;
  prPath: string;
}

const RatingContainer = styled.div`
  span {
    display: inline-block;
    transition: filter 0.1s ease;
    transition: transform 0.1s ease;
    height: 1em;
    width: 1em;
  }

  input[type="radio"] {
    display: none;
  }

  input[type="radio"] + span {
    filter: brightness(80%);
  }

  input[type="radio"]:checked + span {
    filter: unset;
  }

  input[type="radio"]:hover + span {
    filter: unset;
    transform-origin: center bottom;
    transform: scale(1.2);
  }
`;

class PullRequestOverlay extends React.Component<IPullRequestOverlayProps> {
  componentDidMount() {
    this.props.pullRequestStore &&
      this.props.pullRequestStore.loadRating(this.props.prPath);
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
      <div
        style={{
          backgroundColor: "silver",
          border: "solid 2px gray",
          padding: "0.2em 0.4em",
          borderRadius: "2px"
        }}
      >
        <RatingContainer>
          <RatingRadioButton
            value={1}
            rating={this.props.pullRequestStore.rating}
            onChange={this.handleRating.bind(this)}
            labelText="😧"
          />

          <RatingRadioButton
            value={2}
            rating={this.props.pullRequestStore.rating}
            onChange={this.handleRating.bind(this)}
            labelText="😔"
          />
          <RatingRadioButton
            value={3}
            rating={this.props.pullRequestStore.rating}
            onChange={this.handleRating.bind(this)}
            labelText="😑"
          />
          <RatingRadioButton
            value={4}
            rating={this.props.pullRequestStore.rating}
            onChange={this.handleRating.bind(this)}
            labelText="🙂"
          />

          <RatingRadioButton
            value={5}
            rating={this.props.pullRequestStore.rating}
            onChange={this.handleRating.bind(this)}
            labelText="😍"
          />
        </RatingContainer>
        <TitlePanel />
      </div>
    );
  }
}

export default inject("pullRequestStore")(observer(PullRequestOverlay));
