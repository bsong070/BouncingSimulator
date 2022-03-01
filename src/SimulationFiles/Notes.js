import "./cell.css";

let Notes = () => {
  return (
    <div class="container fill">
      <div class="embed-responsive embed-responsive-4by3">
        <iframe
          class="embed-responsive-item"
          src={require("./Notes/BouncingSimulatorNotes.pdf")}
        ></iframe>
      </div>
    </div>
  );
};

export default Notes;
