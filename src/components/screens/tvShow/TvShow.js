import React from 'react'
import styled from "styled-components";
function TvShow(props) {
    const { imgSrc, name, rating } = props;
    return (
        <Display>
            <Thumbnail>
                <img src={imgSrc} alt="img"/>
            </Thumbnail>
            <Name>{name}</Name>
            <Rating>{rating || "N/A"}</Rating>
        </Display>
    );
};

const Display = styled.div`
  width: 100%;
  min-height: 6em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d8d8d878;
  padding: 6px 8px;
`;
const Thumbnail = styled.div`
  width: 90px;
  height: 100px;
  margin-right: 20px;
  img {
      width: 100%;
      height: 100%;

  }
`;
const Name = styled.h3`
  font-size: 20px;
  color: #000;
  margin-left: 10px;
  display: flex;
  flex: 2;
`;
const Rating = styled.span`
  color: #a1a1a1;
  font-size: 16px;
  display: flex;
  flex: 1;
`;

export default TvShow;
