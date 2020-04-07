import React from 'react'
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { FeaturesControl } from "./FeaturesControl";
import { FormControl } from "@material-ui/core";


configure({ adapter: new Adapter() });

describe('<FeaturesControl />', () => {

    it('Should render loaders if loading is true', () => {
        const wrapper = shallow(<FeaturesControl loading={true} locale={{}} features={[]} />)
        expect(wrapper.contains(<div className="animated-background text-line"></div>)).toEqual(true);
    });

    it('Should render 5 Checkbox if loading is false', () => {
        const wrapper = shallow(<FeaturesControl loading={false} locale={{}} classes={{}} features={['open']} />)
        expect(wrapper.find(FormControl)).toHaveLength(5);
    });

});