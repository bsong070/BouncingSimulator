let about = () => {
  return (
    <div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Symbol</th>
            <th scope="col">Name</th>
            <th scope="col">Explanation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              <img className="about-image" src={require("./start.png")} />
            </th>
            <td>Start Position</td>
            <td>Ball starts here</td>
          </tr>
          <tr>
            <th scope="row">
              <img className="about-image" src={require("./target.png")} />
            </th>
            <td>Target</td>
            <td>End goal for the ball to hit</td>
          </tr>
          <tr>
            <th scope="row">
              <img className="about-image" src={require("./previous.png")} />
            </th>
            <td>Previous Position</td>
            <td>
              Marks a cell that the ball visited for illustration purposes
            </td>
          </tr>
          <tr>
            <th scope="row">
              <img className="about-image" src={require("./ball.png")} />
            </th>
            <td>Ball</td>
            <td>Current ball location</td>
          </tr>
          <tr>
            <th scope="row">
              <></>
            </th>
            <td>Velocity</td>
            <td>Rate at which position changes with time</td>
          </tr>
          <tr>
            <th scope="row">
              <></>
            </th>
            <td>Acceleration</td>
            <td>Rate at which velocity changes with time</td>
          </tr>
          <tr>
            <th scope="row">
              <></>
            </th>
            <td>Time</td>
            <td>Each time is a new ball location</td>
          </tr>
          <tr>
            <th scope="row">
              <></>
            </th>
            <td>+X</td>
            <td>Positive X-axis orientation here is towards the right</td>
          </tr>
          <tr>
            <th scope="row">
              <></>
            </th>
            <td>+Y</td>
            <td>Positive Y-axis orientation here is towards the bottom</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default about;
