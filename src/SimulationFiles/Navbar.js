import BouncingSimulator from "./BouncingSimulator";
import About from "./About";
import Notes from "./Notes";

const Navbar = () => {
  return (
    <div className="container-bg">
      <div class="container">
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item">
            <a
              class="nav-link active"
              id="pills-home-tab"
              data-toggle="pill"
              href="#pills-home"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              Home
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              id="pills-alerts-tab"
              data-toggle="pill"
              href="#pills-about"
              role="tab"
              aria-controls="pills-about"
              aria-selected="false"
            >
              About
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              id="pills-alerts-tab"
              data-toggle="pill"
              href="#pills-notes"
              role="tab"
              aria-controls="pills-notes"
              aria-selected="false"
            >
              Notes
            </a>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <BouncingSimulator />
          </div>
          <div
            class="tab-pane fade"
            id="pills-about"
            role="tabpanel"
            aria-labelledby="pills-about-tab"
          >
            <About />
          </div>
          <div
            class="tab-pane fade"
            id="pills-notes"
            role="tabpanel"
            aria-labelledby="pills-notes-tab"
          >
            <Notes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
