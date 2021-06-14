import React, { Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IoSearch, IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import MoonLoader from "react-spinners/MoonLoader";
import { useDebounce } from "./hooks/DebounceHook";
import axios from "axios";
import TvShow from "./tvShow/TvShow";

function SearchBar() {
  const [isExpanded, setExpanded] = useState(false);
  const [clickRef, isClickOutside] = useClickOutside();
  const inputRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [tvShows, setTvShows] = useState([]);
  const [noTvShows, setNoTvShows] = useState(false);

  const isEmpty = !tvShows || tvShows.length === 0;

  const changeHandler = (event)=>{
    event.preventDefault();
    if (event.target.value === "") {
      setNoTvShows(false);
      setTvShows([]);
    };
    setSearchQuery(event.target.value)
  };
  const expandContainer = () => {
    setExpanded(true);
  };
  const collapseContainer = () => {
    setExpanded(false);
    setSearchQuery("");
    setLoading(false);
    setNoTvShows(false);
    setTvShows([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  useEffect(() => {
    if (isClickOutside) collapseContainer();
  }, [isClickOutside]);

  const prepareSearchQuery = (query)=>{
    const url = `http://api.tvmaze.com/search/shows?q=${query}`;
    return encodeURI(url);
  };

  const searchTvShows = async ()=>{
    if (!searchQuery || searchQuery.trim() === "") return;
    setLoading(true);
    const URL = prepareSearchQuery(searchQuery);
    const response = await axios.get(URL).catch((err)=>{
      console.log("Error", err);
    });
    if (response) {
      // console.log(response.data);
      setTvShows(response.data);
      if(response.data && response.data.length === 0) {
        setNoTvShows(true);
      }
    };
    setLoading(false);
  };
  
  useDebounce(searchQuery, 500, searchTvShows);

  return (
    <Container
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVarients}
      transition={containerTransition}
      ref={clickRef}
    >
      <InputContainer>
        <SearchIcon>
          <IoSearch />
        </SearchIcon>
        <SearchInput
          placeholder="Search Something..."
          onFocus={expandContainer}
          ref={inputRef}
          value={searchQuery}
          onChange={changeHandler}
        />
        <AnimatePresence>
          {isExpanded && (
            <CloseIcon
              key="close-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={collapseContainer}
            >
              <IoClose />
            </CloseIcon>
          )}
        </AnimatePresence>
      </InputContainer>
      {isExpanded && <LineSeprator />}
      {isExpanded && <SearchContent>
        {isLoading && (
          <LodingWrapper>
            <MoonLoader loading color="#000" size={20} />
          </LodingWrapper>
        )}
        {!isLoading && isEmpty && !noTvShows&&( 
        <LodingWrapper>
          <WarningMsg>No recent searches</WarningMsg>
        </LodingWrapper>
        )}
        {!isLoading && noTvShows &&( 
        <LodingWrapper>
          <WarningMsg>No Tv Shows or Series found</WarningMsg>
        </LodingWrapper>
        )}
        {!isLoading && !isEmpty && (
        <Fragment>
          {tvShows.map(({show})=>(
            <TvShow key={show.id} imgSrc={show.image && show.image.medium} name={show.name} rating={show.rating && show.rating.average}/>
          ))}
        </Fragment>
        )}
      </SearchContent>}
    </Container>
  );
}

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 34em;
  height: 3.8em;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.14);
`;
const InputContainer = styled.div`
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px 15px;
`;
const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 21px;
  color: #12112e;
  border-radius: 6px;
  font-weight: 500;
  background-color: transparent;
  &:focus {
    outline: none;
    /* &::placeholder {
          opacity: 0;
      } */
  }
  &::placeholder {
    color: #bebebe;
    transition: all 250ms ease-in-out;
  }
`;

const SearchIcon = styled.span`
  color: #bebebe;
  font-size: 27px;
  margin-right: 10px;
  margin-top: 6px;
  vertical-align: middle;
`;

const CloseIcon = styled(motion.span)`
  color: #bebebe;
  font-size: 27px;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;
  &:hover {
    color: #dfdfdf;
  }
`;
const LineSeprator = styled.span`
  display: flex;
  min-width: 100%;
  min-height: 2px;
  background-color: #d8d8d878;
`;
const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  overflow-y: auto;
`;
const LodingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  align-items: center;
  justify-content: center;
`;
const WarningMsg = styled.span`
  color: #a1a1a1;
  font-size: 16px;
  display: flex;
  align-self: center;
  justify-self: center;
  user-select: none;
`;
const containerVarients = {
  expanded: {
    height: "26em",
  },
  collapsed: {
    height: "3.8em",
  },
};
const containerTransition = {
  type: "spring",
  damping: 22,
  stiffnes: 150,
};

export default SearchBar;