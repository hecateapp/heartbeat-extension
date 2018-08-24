import * as React from "react";
import { SFC } from "react";
import styled from "styled-components";
const RatingLabel = styled.label`
  margin: 0.1em 0.2em;
`;

const RatingRadioButton: SFC<{
  value: number;
  rating: number;
  labelText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, rating, onChange, labelText }) => (
  <RatingLabel>
    <input
      type="radio"
      name="rating"
      value={value}
      checked={value === rating}
      onChange={onChange}
    />
    <span>{labelText}</span>
  </RatingLabel>
);

export default RatingRadioButton;
