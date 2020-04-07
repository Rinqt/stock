import React, { Component } from "react";
import { Button } from "@material-ui/core"


class Pagination extends Component {
    render() {
        const { total, perPage, paginate, list, currentPage } = this.props;
        const totalPages = Math.ceil(total / perPage);
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(<Button className="pagination-item" size="small" disabled={i === currentPage} key={i} onClick={() => {
                paginate(i, perPage, list)
            }}>{i}</Button>)
        }

        return (
            <div className="pagination">
                {totalPages > 1 && items}
            </div>
        );
    }
}

export default Pagination;
