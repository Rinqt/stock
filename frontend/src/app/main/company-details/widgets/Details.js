import React, { Component } from "react";
import { withStyles, Card, Typography } from "@material-ui/core";
import CompanyDetailsLoader from "../../shared-widgets/loaders/CompanyDetailsLoader";

const styles = theme => ({
  layoutRoot: {},
  detailHeader: {
    fontWiehgt: "bold",
    marginRight: "10px"
  }
});

class Details extends Component {
  render() {
    const { data, classes, loading, locale } = this.props;

    return (
      <Card className="w-full rounded-8 shadow-none border-1">
        {loading ? (
          <CompanyDetailsLoader />
        ) : (
          <>
            <div className="relative p-24 flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <Typography  variant="h6">
                  {locale.detailsHistory}
                </Typography>
              </div>
            </div>
            <div className="relative  pl-24  pr-24 pb-8  pt-8  flex flex-row items-center justify-between">
              <div className="flex">
                <Typography
                  component="span"
                  className={classes.detailHeader}
                  variant="subtitle2"
                >
                  {locale.name}:
                </Typography>
                <Typography component="span" variant="body2">
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.name}
                  </a>
                </Typography>
              </div>
            </div>

            <div className="relative  pl-24  pr-24 pb-8  pt-8  flex flex-row items-center justify-between">
              <div className="flex">
                <Typography
                  component="span"
                  className={classes.detailHeader}
                  variant="subtitle2"
                >
                  {locale.ceo}:
                </Typography>
                <Typography component="span" variant="body2">
                  {data.ceo}
                </Typography>
              </div>
            </div>

            <div className="relative pl-24  pr-24  pb-8  pt-8 flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <Typography
                  component="span"
                  className={classes.detailHeader}
                  variant="subtitle2"
                >
                  {locale.description}:
                </Typography>
                <Typography component="p" variant="body2">
                  {data.description}
                </Typography>
              </div>
            </div>

            <div className="relative pl-24  pr-24 pb-8 flex flex-row items-center justify-between">
              <div className="flex">
                <Typography
                  component="span"
                  className={classes.detailHeader}
                  variant="subtitle2"
                >
                  {locale.industries}:
                </Typography>
                <Typography component="span" variant="body2">
                  {data.tags ? data.tags.join(", ") : "-"}
                </Typography>
              </div>
            </div>

            <div className="relative  pl-24  pr-24 pb-8  pt-8  flex flex-row items-center justify-between">
              <div className="flex">
                <Typography
                  component="span"
                  className={classes.detailHeader}
                  variant="subtitle2"
                >
                  {locale.employees}:
                </Typography>
                <Typography component="span" variant="body2">
                  {data.employees}
                </Typography>
              </div>
              <div className="flex">
                <Typography
                  component="span"
                  className={classes.detailHeader}
                  variant="subtitle2"
                >
                  {locale.hq}:
                </Typography>
                <Typography component="span" variant="body2">
                  {data.city} , {data.country}
                </Typography>
              </div>
            </div>
            <div className="relative pl-24 pr-24 pb-24 flex flex-row items-center justify-between">
              <div className="flex"></div>
            </div>
          </>
        )}
      </Card>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Details);
