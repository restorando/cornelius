;(function(exports){

  var options = {
    monthNames: ['January', 'February', 'March', 'April', 'June', 'July',
                 'August', 'September', 'October', 'November', 'December'],

    repeatLevels: {
      'low': [0, 2],
      'medium-low': [2, 5],
      'medium': [5, 10],
      'medium-high': [10, 30],
      'high': [30, 50],
      'hot': [50, 70],
      'extra-hot': [70, 100]
    },

    labels: {
      time: 'Time',
      people: 'People'
    },

    drawEmptyCells: true,

    rawNumberOnHover: true,

    classPrefix: 'cornelius-',

    formatHeaderLabel: function(i) {
      switch (true) {
        case i === 0:
          return this.labels['time'];
        case i === 1:
          return this.labels['people'];
        default:
          return (i - 1).toString();
      }
    }
  };

  function extend(target, source) {
    for (var prop in source) target[prop] = source[prop];
    return target;
  }

  function create(el, options) {
    options = options || {};

    el = document.createElement(el);

    if ((className = options.className)) {
      delete options.className;
      el.className = prefixClass(className);
    }
    if ((textContent = options.text)) {
      delete options.text;
      el.textContent = textContent;
    }

    for (var option in options) {
      if ((opt = options[option])) el[option] = opt;
    }

    return el;
  }

  function prefixClass(className) {
    var prefixedClass = [],
      classes = className.split(/\s+/);

    for (var i in classes) {
      prefixedClass.push(options.classPrefix + classes[i]);
    }
    return prefixedClass.join(" ");
  }

  function isNumber(val) {
    return Object.prototype.toString.call(val) === '[object Number]';
  }

  var Cornelius = function Cornelius(opts) {
    this.options = extend(options, opts || {});
  };

  function drawHeader(data) {
    var th = create('tr'),
      monthLength = data[0].length,
      classNames = ['time', 'people'];

    for (var i = 0; i < monthLength; i++) {
      th.appendChild(create('th', { text: options.formatHeaderLabel(i), className: classNames[i]}));
    }
    return th;
  }

  function drawCells(data) {
    var fragment = document.createDocumentFragment(),

    formatPercentage = function(value, base) {
      if (isNumber(value)) return (value / base * 100).toFixed(2);
    },

    classNameFor = function(value) {
      var levels = options.repeatLevels,
        floatValue = value && parseFloat(value),
        highestLevel = null;

      var classNames = ['percentage'];

      for (var level in levels) {
        if (floatValue >= levels[level][0] && floatValue < levels[level][1]) {
          classNames.push(level);
          return classNames.join(" ");
        }
        highestLevel = level;
      }

      // handle 100% case
      classNames.push(highestLevel);
      return classNames.join(" ");

    };

    for (var i in data) {
      var tr = create('tr'),
        row = data[i],
        baseValue = row[1];

      for (var j = 0; j < data[0].length; j++) {
        var value = row[j],
          cellValue = j < 2 ? value : formatPercentage(value, baseValue),
          td = null;

          if (cellValue) {
            td = create('td', {
              text: cellValue,
              title: j > 1 && options.rawNumberOnHover ? value : null,
              className: j > 1 ? classNameFor(cellValue) :
                         j === 0 ? 'label' : 'people'
            });
          } else if (options.drawEmptyCells) {
            td = create('td', { text: '-', className: 'empty' });
          } else {
            td = create('td');
          }

        tr.appendChild(td);
      }
      fragment.appendChild(tr);
    }
    return fragment;
  }

  Cornelius.prototype.draw = function(data) {
    var container = create('div', { className: 'container' }),
      table = create('table', { className: 'table' });

    table.appendChild(drawHeader(data));
    table.appendChild(drawCells(data));

    container.appendChild(create('div', { text: options.title, className: 'title' }));
    container.appendChild(table);

    document.body.appendChild(container);
  };

  exports.Cornelius = Cornelius;

})(window);
