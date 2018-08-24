import * as React from "react";
import { SFC } from "react";
import styled from "styled-components";

const Panel = styled.div`
    margin-top: 0.2em;
    margin-bottom: 0.1em;
`

const TitlePanel: SFC = () => <Panel>Hecate Heartbeat</Panel>;

export default TitlePanel;