import React from 'react'
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { Chart } from "./Chart";
import ChartLoader from "../loaders/ChartLoader";
import { Line } from "react-chartjs-2";

configure({ adapter: new Adapter() });

describe('<Chart />', () => {

    it('Should render loaders if loading is true', () => {
        const  wrapper = shallow(<Chart  loading={true} title="" data={{}} theme={{}}/>)
         expect(wrapper.contains(<ChartLoader />)).toEqual(true);
     });


     it('Should render line chart if there is data set and loading false', () => {
        const  wrapper = shallow(<Chart  loading={false} title="" data={{}} theme={{}}/>)
         expect(wrapper.find(Line)).toHaveLength(1);
     });

});