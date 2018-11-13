import * as React from "react";
import { SFC } from "react";

import Button from "@material-ui/core/Button";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import styled from "styled-components";

import { Badge } from "@material-ui/core";

const FAB = styled(Button)`
  margin: 1em;
`;

const HeartbeatFAB: SFC<{
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}> = ({ onClick }) => (
  <FAB variant="fab" color="primary" onClick={onClick}>
    <Badge badgeContent={"!"} color="secondary">
      <FavoriteBorderIcon fontSize="large" />
    </Badge>
  </FAB>
);

export default HeartbeatFAB;
