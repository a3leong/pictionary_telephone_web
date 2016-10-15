import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';

import './DrawBoard.css';

class DrawBoard extends React.Component {
  render() {
    return (
      <div className="DrawBoard">
        <Card>
          <CardTitle title="Draw Board" subtitle="Sketch your stuff here!" />
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
        </Card>
      </div>
    )
  }
}

export default DrawBoard;
