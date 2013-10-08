/*!
 * Cornelius library v0.1
 * http://restorando.github.io/cornelius
 *
 * Copyright (c) 2013 Restorando
 * Released under the MIT license
 *
 * Date: 2013-06-04
 */

;(function(globals) {
    /* Constants for setting the data type to be displayed in the cells */
    var TYPE_PERCENTAGE = 'percentage';
    var TYPE_ABSOLUTE = 'absolute';

    var corneliusDefaults = {
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                     'August', 'September', 'October', 'November', 'December'],

        shortMonthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                          'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        repeatLevels: {
            'low': [0, 10],
            'medium-low': [10, 20],
            'medium': [20, 30],
            'medium-high': [30, 40],
            'high': [40, 60],
            'hot': [60, 70],
            'extra-hot': [70, 100]
        },

        labels: {
            time: 'Time',
            people: 'People',
            weekOf: 'Week of'
        },

        timeInterval: 'monthly',

        drawEmptyCells: true,

        rawNumberOnHover: true,

        initialIntervalNumber: 1,

        classPrefix: 'cornelius-',

        formatHeaderLabel: function(i) {
            return (this.initialIntervalNumber - 1 + i).toString();
        },

        formatDailyLabel: function(date, i) {
            date.setDate(date.getDate() + i);
            return this.monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + getYear(date);
        },

        formatWeeklyLabel: function(date, i) {
            date.setDate(date.getDate() + i * 7);
            return this.labels.weekOf + ' ' + this.shortMonthNames[date.getMonth()] + ' ' +
                    date.getDate() + ', ' + getYear(date);
        },

        formatMonthlyLabel: function(date, i) {
            date.setMonth(date.getMonth() + i);
            return this.monthNames[date.getMonth()] + ' ' + getYear(date);
        },

        formatYearlyLabel: function(date, i) {
            return date.getYear() + 1900 + i;
        }
    },

    defaults = corneliusDefaults;

    function extend() {
        var target = arguments[0];

        if (arguments.length === 1) return target;

        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var prop in source) target[prop] = source[prop];
        }

        return target;
    }

    function isNumber(val) {
        return Object.prototype.toString.call(val) === '[object Number]';
    }

    function isEmpty(val) {
        return val === null || val === undefined || val === "";
    }

    function getYear(date) {
        return date.getFullYear ? date.getFullYear() : date.getYear() + 1900;
    }

    function formatValue(value, base, valueType) {
        if (valueType == TYPE_ABSOLUTE) {
            return value;
        } else if (isNumber(value) && base > 0) {
            return (value / base * 100).toFixed(2);
        } else if (isNumber(value)) {
            return "0.00";
        }
    }

    function setText(element, text) {
        if (document.all) {
            element.innerText = text;
        } else {
            element.textContent = text;
        }
    }

    function addClass(element, className) {
        if (!new RegExp(className).test(element.className)) {
            element.className += ' ' + className;
        }
    }

    function removeClass(element, className) {
        element.className = element.className.replace(className, '');
    }

    // prefix any css class we use in order to avoid any possible clashes
    function prefixClass(className, classPrefix) {
        var prefixedClass = [],
            classes = className.split(/\s+/);

        for (var i in classes) {
            prefixedClass.push(classPrefix + classes[i]);
        }

        return prefixedClass.join(" ");
    }

    var draw = function(cornelius, cohort, container) {
        if (!cohort)    throw new Error ("Please provide the cohort data");
        if (!container) throw new Error ("Please provide the cohort container");

        var config = cornelius.config,
            initialDate = cornelius.initialDate;

        function create(el, options) {
            options = options || {};

            el = document.createElement(el);

            if ((className = options.className)) {
                delete options.className;
                el.className = prefixClass(className, config.classPrefix);
            }
            if (!isEmpty(options.text)) {
                var text = options.text.toString();
                setText(el, text);

                delete options.text;
            }

            for (var option in options) {
                if ((opt = options[option])) el[option] = opt;
            }

            return el;
        }

        function drawHeader(data) {
            var th = create('tr'),
                monthLength = data[0].length;

            th.appendChild(create('th', { text: config.labels.time, className: 'time' }));

            for (var i = 0; i < monthLength; i++) {
                if (i > config.maxColumns) break;
                var text = i === 0 ? config.labels.people : config.formatHeaderLabel(i);
                th.appendChild(create('th', { text: text, className: 'people' }));
            }
            return th;
        }

        function formatTimeLabel(initial, timeInterval, i) {
            var date = new Date(initial.getTime()),
                formatFn = null;

            if (timeInterval === 'daily') {
                formatFn = 'formatDailyLabel';
            } else if (timeInterval === 'weekly') {
                formatFn = 'formatWeeklyLabel';
            } else if (timeInterval === 'monthly') {
                formatFn = 'formatMonthlyLabel';
            } else if (timeInterval === 'yearly') {
                formatFn = 'formatYearlyLabel';
            } else {
                throw new Error("Interval not supported");
            }

            return config[formatFn].call(config, date, i);
        }

        function drawCells(data) {
            var fragment = document.createDocumentFragment(),

                startMonth = config.maxRows ? data.length - config.maxRows : 0,

                classNameFor = function(value) {
                    var levels = config.repeatLevels,
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

            for (var i = startMonth; i < data.length; i++) {
                var tr = create('tr'),
                    row = data[i],
                    baseValue = row[0];

                tr.appendChild(create('td', {
                    className: 'label',
                    text: formatTimeLabel(initialDate, config.timeInterval, i)
                }));

                for (var j = 0; j < data[0].length; j++) {
                    if (j > config.maxColumns) break;

                    var value = row[j],
                        cellValue = j === 0 ? value : formatValue(value, baseValue, TYPE_PERCENTAGE),
                        opts = {};

                        if (!isEmpty(cellValue)) {
                            opts = {
                                text: cellValue,
                                title: j > 0 && config.rawNumberOnHover ? value : null,
                                className: j === 0 ? 'people' : classNameFor(cellValue)
                            };
                        } else if (config.drawEmptyCells) {
                            opts = { text: '-', className: 'empty' };
                        }

                    tr.appendChild(create('td', opts));
                }
                fragment.appendChild(tr);
            }
            return fragment;
        }

        var mainContainer = create('div', { className: 'container' }),
            table = create('table', { className: 'table' });

        table.appendChild(drawHeader(cohort));
        table.appendChild(drawCells(cohort));

        if ((title = config.title)) {
            mainContainer.appendChild(create('div', { text: title, className: 'title' }));
        }
        mainContainer.appendChild(table);

        container.innerHTML = "";
        container.appendChild(mainContainer);
    };

    var Cornelius = function(opts) {
        if (!(initialDate = opts.initialDate)) throw new Error('The initialDate is a required argument');
        delete opts.initialDate;

        this.initialDate = initialDate;
        this.valueType = TYPE_PERCENTAGE;
        this.config = extend({}, Cornelius.getDefaults(), opts || {});

        this.toggleValues = function() {
          this.valueType = this.valueType == TYPE_PERCENTAGE ? TYPE_ABSOLUTE : TYPE_PERCENTAGE
          var table = opts.container.getElementsByTagName('table')[0];

          for (var rowIndex = 0; rowIndex < opts.cohort.length; rowIndex++) {
            var tr = table.children[rowIndex + 1];
            for (var cellIndex = 1; cellIndex < opts.cohort[rowIndex].length; cellIndex++) {
                var td = tr.children[cellIndex + 1];
                var toggledValue = formatValue(opts.cohort[rowIndex][cellIndex], opts.cohort[rowIndex][0], this.valueType);
                setText(td, toggledValue);
                if (this.valueType == TYPE_ABSOLUTE) {
                    removeClass(td, prefixClass('percentage', this.config.classPrefix));
                } else {
                    addClass(td, prefixClass('percentage', this.config.classPrefix));
                }
            }
          }
        }
    };

    extend(Cornelius, {
        getDefaults: function() {
            return defaults;
        },

        setDefaults: function(def) {
            defaults = extend({}, corneliusDefaults, def);
        },

        resetDefaults: function() {
            defaults = corneliusDefaults;
        },
        draw: function(options) {
            var cornelius = new Cornelius(options);
            draw(cornelius, options.cohort, options.container);
            return cornelius;
        }
    });

    if (typeof jQuery !== "undefined" && jQuery !== null) {
        jQuery.fn.cornelius = function(options) {
            return this.each(function() {
                options.container = this;
                return Cornelius.draw(options);
            });
        };
    }

    // show it to the world!!
    if (globals.exports) {
        globals.exports = Cornelius;
    } else {
        globals.Cornelius = Cornelius;
    }
})(typeof module === "function" ? module : window);
