import { Fragment } from "react";
import Global from "./Global";
import styled from "styled-components";
import SearchBar from "./components/screens/SearchBar";

function App() {
  return (
    <Fragment>
      <Global />
      <AppContainer>
        <SearchBar />
      </AppContainer>
    </Fragment>
  );
};

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 8em;
`;
export default App;
