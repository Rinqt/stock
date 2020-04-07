import React, { Component } from "react";
import ParagraphLoader from "./ParagraphLoader";

class CompanyDetailsLoader extends Component {
  render() {
    return (
      <>
        <div className="relative p-24 flex flex-row items-center justify-between">
          <div className="quarter-lineanimated-background text-line"></div>
        </div>
        <div className="relative pl-24  pr-24 pb-8 flex flex-row items-center justify-between">
          <div className="quarter-line animated-background text-line"></div>
        </div>
        <div className="relative  pl-24  pr-24 pb-8  pt-8  flex flex-row items-center justify-between">
          <div className="quarter-line animated-background text-line"></div>
          <div className="quarter-line animated-background text-line"></div>
        </div>
        <div className="relative pl-24  pr-24  pb-8  pt-8 flex flex-col items-start justify-between">
          <div className="quarter-line animated-background text-line"></div>
          <ParagraphLoader />
        </div>
        <div className="relative pl-24  pr-24 pb-8 flex flex-row items-center justify-between">
          <div className="half-line animated-background text-line"></div>
        </div>
        <div className="relative  pl-24  pr-24 pb-8  pt-8  flex flex-row items-center justify-between">
          <div className="quarter-line animated-background text-line"></div>
          <div className="quarter-line animated-background text-line"></div>
        </div>
        <div className="relative pl-24  pr-24 pb-8 flex flex-row items-center justify-between">
          <div className="quarter-line animated-background text-line"></div>
        </div>
      </>
    );
  }
}

export default CompanyDetailsLoader;
