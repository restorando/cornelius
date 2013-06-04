---
layout: default
title: Cornelius
---

**Cornelius** can draw a Cohort Chart like this for you:

<div id="main-example"></div>

{% include main_example.html %}

Only with this code:

{% highlight html %}
{% include main_example.html %}
{% endhighlight %}

# Installation

Just include the javascript and stylesheet files and you are ready to go. No jQuery needed, dependency free.

{% highlight html %}
<link rel="stylesheet" type="text/css" href="cornelius.css" />
<script type="text/javascript" src="cornelius.js"></script>
{% endhighlight %}

If you are using [component](http://component.io):

    $ component install restorando/cornelius

# API

There is only one method you can use:

{% highlight javascript %}
Cornelius.draw({

  // required params

  initialDate: new Date(2013, 03),

  container: document.getElementById('my-container'),

  cohort: [
    [1973,1000,750,300,400,70,20],
    [1268,549,336,221,122,115],
    [1892,1282,250,32,18],
    [1832,379,254,314],
    [1171,256,120],
    [2533,340]
  ],

  /* any other options */

  timeInterval: 'weekly'
});
{% endhighlight %}

The `initialDate` property is a `Date` object that will be used as the initial date
to compute the following dates that will be shown in the chart.

This `Date` object should have the `date` part of the object set as the beginning of the month (day 1),
and must have the time set to '00:00'.

{% highlight javascript %}
var date = new Date(2012, 6); // Sun Jul 01 2012 00:00:00
{% endhighlight %}

Be careful with the month argument you pass since the `Date` object considers January as month 0.

## Data Format

The `cohort` property must be an array of arrays whose values will be mapped to the cohort table cells in the same order as provided. Given the distinctive triangle shape of the chart, each array should either have a value less than the previous one, or it should be filled with `null`, `undefined`, or `false` values.

# Options

Cornelius accepts any of these option values passed to the constructor:

## timeInterval

Cornelius accepts 4 time intervals that are used to compute the date labels: `daily`, `weekly`, `monthly`, `yearly`.

Example:
<div id="time-interval-example"></div>

<script type="text/javascript">
{% include time_interval_example.html %}
</script>

{% highlight javascript %}
{% include time_interval_example.html %}
{% endhighlight %}

Default: `'monthly'`

## repeatLevels

It is possible to customize the colours of the cells depending on the percentage each of them have.
You will have to specify the class names and the percentage ranges the library will use in order to decide which class
will be assigned to each cell.

Below are the default css classes and ranges the library uses.

{% highlight javascript %}

var repeatLevels = {
  'low': [0, 10],
  'medium-low': [10, 20],
  'medium': [20, 30],
  'medium-high': [30, 40],
  'high': [40, 60],
  'hot': [60, 70],
  'extra-hot': [70, 100]
}

Cornelius.draw({
  repeatLevels: repeatLevels,

  initialDate: new Date(2012, 3),
  cohort: data,
  container: document.getElementById('container')
});
{% endhighlight %}

In this example, Cornelius will assign the `cornelius-low` class to each cell with a value between 0%
and 10%, `cornelius-medium-low` to each cell between 10% and 20%, and so on.

You can specify as many ranges and class names as you want, but don't forget to add those classes to
your stylesheets.

## drawEmptyCells

Setting this property to `true` will display a white empty cell for those cells that are "outside"
of the main triangle.

Example:

{% highlight javascript %}
{% include empty_cells_example.html %}
{% endhighlight %}

<div id="empty-cells-example"></div>

<script type="text/javascript">
{% include empty_cells_example.html %}
</script>

Default: `true`

## rawNumberOnHover

If `rawNumberOnHover` is set to true, it will display the raw number while leaving the mouse on top of the cell.

Default: `true`

## initialIntervalNumber

This property will allow you to specify the initial number that will be displayed in the first column header.

Default: `1`

## I18n

The library uses only 3 strings for the labels that can be specified in the options object:

{% highlight javascript %}
Cornelius.draw({
  labels: {
    time: 'Zeit', // Time
    people: 'Menschen', // People
    weekOf: 'Woche Vom' // Week Of
  },

  initialDate: new Date(2011, 6),
  cohort: data,
  container: document.getElementById('container')
});
{% endhighlight %}

The long and short month names can also be customized:

{% highlight javascript %}
Cornelius.draw({
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
               'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],

  shortMonthNames: ['Ene', 'Feb', 'Mar', 'Abr', 'Mar', 'Jun', 'Jul',
                    'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],

  initialDate: initialDate,
  cohort: data,
  container: document.getElementById('container')
});
{% endhighlight %}

Alternatively you can specify the functions that will be called to return the Strings for the header
and date labels:

## formatHeaderLabel(index)

If setting the `initialIntervalNumber` and `labels` doesn't fullfill your needs, you can format the header label
using a lower level API. You can pass a function that will be called for every column header that is being drawn, and its return value will be used as the header label. The only parameter it receives is the index of the column that will be drawn (zero index).

Example:

{% highlight javascript %}
{% include format_header_example.html %}
{% endhighlight %}

<div id="format-header-example"></div>

<script type="text/javascript">
{% include format_header_example.html %}
</script>

# Formatting the dates

There are 4 optional parameters that Cornelius can use to format the date labels. Depending on the
time interval you use, you can pass a `formatDailyLabel`, `formatWeeklyLabel`, `formatMonthlyLabel` and
`formatYearlyLabel` function to format a `daily`, `weekly`, `monthly` and `yearly` cohort chart respectively.

These functions takes 2 parameters: the date object corresponding to the initial date, and the column index.

Example:

{% highlight javascript %}
{% include format_date_example.html %}
{% endhighlight %}

<div id="format-date-example"></div>

<script type="text/javascript">
{% include format_date_example.html %}
</script>

# Trimming the table

If your cohort data is too large and want only to display the first N columns or the last M rows, you
can use the `maxRows` and `maxColumns` properties.

Example:

{% highlight javascript %}
{% include trimming_example.html %}
{% endhighlight %}

<div id="trimming-example"></div>

<script type="text/javascript">
{% include trimming_example.html %}
</script>

# Chart Title

To display a title above the chart, use the `title` option:

{% highlight javascript %}
Cornelius.draw({
  title: 'My Chart Title',

  initialDate: new Date(2011, 6),
  cohort: data,
  container: document.getElementById('container')
});
{% endhighlight %}

# Default options

One instance of Cornelius can be used to draw multiple charts using the same options. You can also set
the global defaults that will be used in any Cornelius instance.

Example:

{% highlight javascript %}
Cornelius.getDefaults(); // { ..., initialIntervalNumber: 1, timeInterval: 'monthly', ... }

Cornelius.setDefaults({initialIntervalNumber: 0, timeInterval: 'weekly'});

Cornelius.getDefaults(); // { ..., initialIntervalNumber: 0, timeInterval: 'weekly', ... }

Cornelius.resetDefaults();

Cornelius.getDefaults(); // { ..., initialIntervalNumber: 1, timeInterval: 'monthly', ... }
{% endhighlight %}

# jQuery plugin

Cornelius doesn't have `jQuery` as a dependency. But if you have it already, you can use the jQuery helper:

{% highlight javascript %}
$("#container").cornelius({
  initialDate: new Date(2013, 1),
  // cohort data
  cohort: [
    [100, 30, 23, 10],
    [399, 23, 10, 40]
  ],
  timeInterval: 'daily',
  /* ... other options ... */
});
{% endhighlight %}

# MIT License

Copyright (c) 2013 Restorando

MIT License


Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
