import React from 'react'
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { DataControl } from "./DataControl";
import { Select } from "@material-ui/core";


configure({ adapter: new Adapter() });

describe('<DataControl />', () => {

    it('Should render loaders if loading is true', () => {
        const wrapper = shallow(<DataControl loading={true}  locale={{}} />)
        expect(wrapper.contains(<div className="animated-background text-line half-line"></div>)).toEqual(true);
    });

    it('Should render select box if loading is false', () => {
        const wrapper = shallow(<DataControl loading={false} company="amzn" companies={[]} locale={{}} classes={{}}/>)
        expect(wrapper.find(Select)).toHaveLength(1);
    });

});