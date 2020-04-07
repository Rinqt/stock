import React, { Component } from "react";

class TableRowLoader extends Component {
  render() {
    const { cellsCount } = this.props;
    const cells = [];
    for (let i = 0; i < cellsCount; i++) {
      cells.push(
        <td key={i}>
          <div className="animated-background td-line"></div>
        </td>
      );
    }
    return <tr>{cells}</tr>;
  }
}

export default TableRowLoader;
