let Notes = () => {
  return (
    <div>
      <div class="container">
        <h2>Activate Carousel with JavaScript</h2>
        <div id="myCarousel" class="carousel slide">
          <ol class="carousel-indicators">
            <li class="item1 active"></li>
            <li class="item2"></li>
            <li class="item3"></li>
            <li class="item4"></li>
          </ol>

          <div class="carousel-inner" role="listbox">
            <div class="item active">
              <img
                src={require("./Notes/page1.jpg")}
                width="460"
                height="345"
              />
              <div class="carousel-caption">
                <h3>Chania</h3>
                <p>
                  The atmosphere in Chania has a touch of Florence and Venice.
                </p>
              </div>
            </div>

            <div class="item">
              <img
                src={require("./Notes/page2.jpg")}
                width="460"
                height="345"
              />
              <div class="carousel-caption">
                <h3>Chania</h3>
                <p>
                  The atmosphere in Chania has a touch of Florence and Venice.
                </p>
              </div>
            </div>

            <div class="item">
              <img
                src={require("./Notes/page3.jpg")}
                width="460"
                height="345"
              />
              <div class="carousel-caption">
                <h3>Flowers</h3>
                <p>Beautiful flowers in Kolymbari, Crete.</p>
              </div>
            </div>

            <div class="item">
              <img
                src={require("./Notes/page4.jpg")}
                width="460"
                height="345"
              />
              <div class="carousel-caption">
                <h3>Flowers</h3>
                <p>Beautiful flowers in Kolymbari, Crete.</p>
              </div>
            </div>
          </div>

          <a class="left carousel-control" href="#myCarousel" role="button">
            <span
              class="glyphicon glyphicon-chevron-left"
              aria-hidden="true"
            ></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="right carousel-control" href="#myCarousel" role="button">
            <span
              class="glyphicon glyphicon-chevron-right"
              aria-hidden="true"
            ></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Notes;
