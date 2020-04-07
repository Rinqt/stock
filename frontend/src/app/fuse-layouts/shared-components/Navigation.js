import React from "react";
import { FuseNavigation } from "@fuse";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

const mapLocal = (navigateioArray, localArray) => {
  return [
    ...navigateioArray.map(el => {
      let children = null;
      if (el.children) {
        children = mapLocal(el.children, localArray);
      }
      return { ...el, title: localArray[el.id], children };
    })
  ];
};
const Navigation = ({
  navigation,
  locale,
  layout,
  dense,
  className,
  isLoggedin
}) => {
  const customNav = navigation.map(el => {
    return {
      ...el,
      children: [
        ...el.children.filter(item => {
          return item.showOnLogin === null || item.showOnLogin === isLoggedin;
        })
      ]
    };
  });
  return (
    <FuseNavigation
      className={classNames("navigation", className)}
      navigation={mapLocal(customNav, locale)}
      layout={layout}
      dense={dense}
    />
  );
};

function mapStateToProps({ fuse, custom }) {
  return {
    navigation: fuse.navigation,
    locale: custom.locale.navigation,
    isLoggedin: custom.login.isLoggedin
  };
}

Navigation.defaultProps = {
  layout: "vertical"
};

export default withRouter(connect(mapStateToProps)(Navigation));
