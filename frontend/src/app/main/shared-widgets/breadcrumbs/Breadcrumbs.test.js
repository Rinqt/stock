import React from 'react'
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { Breadcrumbs } from "./Breadcrumbs";
import { Link } from "react-router-dom";

configure({ adapter: new Adapter() });


describe('<Breadcrumbs />', () => {
    const data = [
        {
            title: "Dashboard",
            link: "/app/dashboard"
        },
        {
            title: "Articles",
            link: "/app/articles"
        },
        {
            title: 'title',
            link: ""
        }
    ];
    const locale = {
        Dashboard: 'Dashboard',
        Articles: 'Articles'
    }
    const classes = {
        CustomBreadcrumb: {
            width: "100%"
        },
        BreadcrumbLink: {
            color: "rgba(0, 0, 0, 0.54) !important",
            display: "inline-block",
            fontWeight: 400,
            fontSize: "1.8rem"
        },
        BreadcrumbSperator: {
            display: "inline-block",
            marginLeft: "8px",
            userSelect: "none",
            marginRight: "8px",
            color: "rgba(0, 0, 0, 0.54)",
            fontWeight: 400,
            fontSize: "1.8rem"
        },
        BreadcrumbCurrent: {
            display: "inline-block",
            color: "rgba(0, 0, 0, 0.87)",
            fontWeight: 400,
            fontSize: "1.8rem"
        }
    }
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Breadcrumbs data={data} locale={locale} classes={classes} />)
    })

    it('Should have a 2 links', () => {
        expect(wrapper.find(Link)).toHaveLength(2);
    });

    it('Should have a link to Articles', () => {
        expect(wrapper.contains(<Link className={classes.BreadcrumbLink} to="/app/articles">Articles</Link>)).toEqual(true);
    });

});