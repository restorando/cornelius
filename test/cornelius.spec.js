describe('Cornelius', function() {

  var data = [
    [1000,700,600,500,400,70,20],
    [1200,549,336,221,122,115],
    [900,882,250,32,18],
    [500,379,254,314],
    [400,256,120],
    [600,340]
  ],
  $container;

  function draw(options) {
    $container = $("<div/>");

    options = options || {};
    options.initialDate = new Date(2012, 9);
    options.cohort = data;
    options.container = $container.get(0);
    return Cornelius.draw(options);
  }

  function columnLabels() {
    return $container.find('tr > td:first-child')
                     .map(function(){ return this.textContent; })
                     .get();
  }

  function headerLabels() {
    return $container.find("th")
                     .map(function(){ return this.textContent; })
                     .get();
  }

  describe("Header Labels", function() {

    it("sets the default header labels", function() {
      draw();
      headerLabels().should.deep.equal(["Time", "People", "1", "2", "3", "4", "5", "6"]);
    });

    it("internationalizes the labels", function() {
      draw({labels: {time: 'Fecha', people: 'Personas'}});
      headerLabels().should.deep.equal(["Fecha", "Personas", "1", "2", "3", "4", "5", "6"]);
    });

    it("offsets the interval number", function() {
      draw({initialIntervalNumber: 3});
      headerLabels().should.deep.equal(["Time", "People", "3", "4", "5", "6", "7", "8"]);
    });

    it("accepts a function to render the labels", function() {
      draw({
        formatHeaderLabel: function(i) { return i * 2; }
      });

      headerLabels().should.deep.equal(["Time", "People", "2", "4", "6", "8", "10", "12"]);
    });
  });

  describe("Column Labels", function() {

    it("displays the daily labels", function() {
      draw({timeInterval: 'daily'});
      columnLabels().should.deep.equal(["October 1, 2012", "October 2, 2012",
                                       "October 3, 2012", "October 4, 2012",
                                       "October 5, 2012", "October 6, 2012"]);
    });

    it("displays the weekly labels", function() {
      draw({timeInterval: 'weekly'});
      columnLabels().should.deep.equal(["Week of Oct 1, 2012", "Week of Oct 8, 2012",
                                        "Week of Oct 15, 2012", "Week of Oct 22, 2012",
                                        "Week of Oct 29, 2012", "Week of Nov 5, 2012"]);
    });

    it("displays the monthly labels", function() {
      draw({timeInterval: 'monthly'});
      columnLabels().should.deep.equal(["October 2012", "November 2012", "December 2012",
                                        "January 2013", "February 2013", "March 2013"]);
    });

    it("displays the yearly labels", function() {
      draw({timeInterval: 'yearly'});
      columnLabels().should.deep.equal(["2012", "2013", "2014", "2015", "2016", "2017"]);
    });

    it("internationalizes the week labels", function() {
      draw({timeInterval: 'weekly', labels: {weekOf: "Semana de"}});
      columnLabels().should.deep.equal(["Semana de Oct 1, 2012", "Semana de Oct 8, 2012",
                                        "Semana de Oct 15, 2012", "Semana de Oct 22, 2012",
                                        "Semana de Oct 29, 2012", "Semana de Nov 5, 2012"]);
    });
  });

  describe("Colours", function() {

    var repeatLevels = {
      low: [0,30],
      medium: [30, 60],
      high: [60, 100]
    };

    it("assigns a class to each cell depending on the percentage value", function() {
      draw({repeatLevels: repeatLevels});

      var classes = $container.find('tr:eq(1) td.cornelius-percentage')
                .map(function() { return this.className.replace(/\s*cornelius-percentage\s*/, ''); })
                .get();

      classes.should.deep.equal(["cornelius-high", "cornelius-high", "cornelius-medium",
                                 "cornelius-medium", "cornelius-low", "cornelius-low"]);
    });
  });

  describe("Percentages", function() {

    var expectedValues = [
      ["70.00", "60.00", "50.00", "40.00", "7.00", "2.00"],
      ["45.75", "28.00", "18.42", "10.17", "9.58"],
      ["98.00", "27.78", "3.56", "2.00"],
      ["75.80", "50.80", "62.80"],
      ["64.00", "30.00"],
      ["56.67"]
    ];

    it("renders the percentage values", function() {
      draw();
      $container.find('tr:not(:first)').each(function(i, el){
        var values = $(el).find('.cornelius-percentage').map(function() { return this.textContent; }).get();
        values.should.deep.equal(expectedValues[i]);
      });
    });
  });

  describe("Absolute numbers", function() {

    var expectedValues = [
      ["700", "600", "500", "400", "70", "20"],
      ["549", "336", "221", "122", "115"],
      ["882", "250", "32", "18"],
      ["379", "254", "314"],
      ["256", "120"],
      ["340"]
    ];

    it("renders the absolute values", function() {
      draw({displayAbsoluteValues: true});
      $container.find('tr:not(:first)').each(function(i, el){
        var values = $(el).find('.cornelius-absolute').map(function() { return this.textContent; }).get();
        values.should.deep.equal(expectedValues[i]);
      });
    });

  });

  describe("Options", function() {

    describe("Slicing", function() {

      it ("draws only the last n rows", function() {
        draw({maxRows: 3});
        columnLabels().should.deep.equal(["January 2013", "February 2013", "March 2013"]);
      });

      it ("draws only the first n columns", function() {
        draw({maxColumns: 3});
        headerLabels().should.deep.equal(["Time", "People", "1", "2", "3"]);
      });

    });

    describe("Empty cells", function() {

      it("renders the empty cells", function() {
        draw({drawEmptyCells: true});
        $container.find('.cornelius-empty').should.have.length(15);
      });

      it("hides the empty cells", function() {
        draw({drawEmptyCells: false});
        $container.find('.cornelius-empty').should.have.length(0);
      });

    });

    describe("Raw Numbers", function() {

      it("renders the tooltip", function() {
        draw({rawNumberOnHover: true});
        $container.find('.cornelius-percentage[title]').should.have.length(21);
      });

      it("hides the tooltip", function() {
        draw({rawNumberOnHover: false});
        $container.find('.cornelius-percentage[title]').should.have.length(0);
      });

    });

    describe("Title", function() {
      it("renders the title", function() {
        draw({title: 'Cornelius Demo'});
        $container.find('.cornelius-title').text().should.equal('Cornelius Demo');
      });
    });
  });

  describe("Alternative constructor", function() {
    it("accepts a convenient shortcut constructor", function() {
      $container = $('<div/>');

      Cornelius.draw({
        cohort: data,
        initialDate: new Date(2011, 3),
        container: $container.get(0)
      });

      $container.find('td').should.have.length(48);
    });

    it("can be instantiated via jQuery", function() {
      $container = $('<div/>');
      $container.cornelius({
        cohort: data,
        initialDate: new Date(2011, 3)
      });

      $container.find('td').should.have.length(48);
    });
  });
});
