;(function(exports){

  var options = {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                 'August', 'September', 'October', 'November', 'December'],

    shortMonthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                     'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

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

    timeInterval: 'monthly',

    drawEmptyCells: true,

    rawNumberOnHover: true,

    classPrefix: 'cornelius-',

    formatHeaderLabel: function(i) {
      return i === 0 ? this.labels['people'] : i.toString();
    },

    formatTimeLabel: function(initial, timeInterval, i) {
      var date = new Date(initial.getTime()),
        getMonthName = function(date, wantShort) {
          var monthNames = options[wantShort ? 'shortMonthNames' : 'monthNames'];
          return monthNames[date.getMonth()];
        },
        getYear = function(date) {
          return date.getYear() + 1900;
        };

      if (timeInterval === 'daily') {
        date.setDate(date.getDate() + i);
        return getMonthName(date) + ' ' + date.getDate() + ', ' + getYear(date);
      } else if (timeInterval === 'weekly') {
        date.setDate(date.getDate() + i * 7);
        return 'Week of ' + getMonthName(date, true) + ' ' + date.getDate() + ', ' + getYear(date);
      } else if (timeInterval === 'monthly') {
        date.setMonth(date.getMonth() + i - 1);
        return getMonthName(date) + ' ' + getYear(date);
      } else if (timeInterval === 'yearly') {
        return getYear(date) + i;
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
      monthLength = data[0].length;

    th.appendChild(create('th', { text: options.labels.time, className: 'time' }));

    for (var i = 0; i < monthLength; i++) {
      th.appendChild(create('th', { text: options.formatHeaderLabel(i), className: 'people' }));
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

    for (var i = 0; i < data.length; i++) {
      var tr = create('tr'),
        row = data[i],
        baseValue = row[0];

      tr.appendChild(create('td', {
        className: 'label',
        textContent: options.formatTimeLabel(options.initialDate, options.timeInterval, i)
      }));

      for (var j = 0; j < data[0].length; j++) {
        var value = row[j],
          cellValue = j === 0 ? value : formatPercentage(value, baseValue),
          opts = {};

          if (cellValue) {
            opts = {
              text: cellValue,
              title: j > 0 && options.rawNumberOnHover ? value : null,
              className: j === 0 ? 'people' : classNameFor(cellValue)
            };
          } else if (options.drawEmptyCells) {
            opts = { text: '-', className: 'empty' };
          }

        tr.appendChild(create('td', opts));
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

    if ((title = options.title)) {
      container.appendChild(create('div', { text: title, className: 'title' }));
    }
    container.appendChild(table);

    document.body.appendChild(container);
  };

  exports.Cornelius = Cornelius;

})(window);
