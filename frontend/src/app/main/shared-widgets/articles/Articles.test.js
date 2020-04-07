import React from 'react'
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import Articles from "./Articles"
import ArticleWidgetLoader from "../loaders/ArticleWidgetLoader"
import ListItem from "@material-ui/core/ListItem";

configure({ adapter: new Adapter() });


describe('<Articles />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Articles />)
    });
    
    it('Should render loaders if loading is true', () => {
        wrapper.setProps({
            loading: true,
        })
        expect(wrapper.find(ArticleWidgetLoader)).toHaveLength(1);
    });


    it('Should render loaders if loading is false but not data', () => {
        wrapper.setProps({
            loading: false,
        })
        expect(wrapper.find(ArticleWidgetLoader)).toHaveLength(1);
    });

    it('Should not render loaders if loading is false and there is data', () => {
        const data = [{
            id: "54008c7e-9d83-4dbd-9ad3-52d82e2266b6",
            createdAt: "2020-02-29T16:00:00Z",
            companySymbol: "msft",
            title: "Fin24.com | Cloud computing: invisible, versatile and highly profitable",
            polarity: "Positive",
        }]
        wrapper.setProps({
            loading: false,
            data
        })
        expect(wrapper.find(ListItem)).toHaveLength(1);
    });

    it('Should render loaders if loading is true and there is data', () => {
        const data = [{
            id: "54008c7e-9d83-4dbd-9ad3-52d82e2266b6",
            createdAt: "2020-02-29T16:00:00Z",
            companySymbol: "msft",
            title: "Fin24.com | Cloud computing: invisible, versatile and highly profitable",
            polarity: "Positive",
        }]

        wrapper.setProps({
            loading: true,
            data
        })

        expect(wrapper.find(ListItem)).toHaveLength(0);
    });
});