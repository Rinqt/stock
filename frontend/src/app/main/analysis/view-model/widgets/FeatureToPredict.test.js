import React from 'react'
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { FeatureToPredict } from "./FeatureToPredict";
import { FormControl } from "@material-ui/core";


configure({ adapter: new Adapter() });

describe('<FeatureToPredict />', () => {

    it('Should render loaders if loading is true', () => {
        const wrapper = shallow(<FeatureToPredict loading={true} locale={{}} value={""} />)
        expect(wrapper.contains(<div className="animated-background text-line"></div>)).toEqual(true);
    });

    it('Should render 5 Checkbox if loading is false', () => {
        const wrapper = shallow(<FeatureToPredict loading={false} locale={{}} classes={{}} value={""} />)
        expect(wrapper.find(FormControl)).toHaveLength(5);
    });

});