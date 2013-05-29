---
layout: default
title: Cornelius
---

# Introduction

**Cornelius** allows you to draw Cohort Charts like this:

<div id="main-example"></div>

{% include main_example.html %}

Writing only this code:

{% highlight html %}
{% include main_example.html %}
{% endhighlight %}

# Installation

Just include the javascript and stylesheet files and you are ready to go.

{% highlight html %}
<link rel="stylesheet" type="text/css" href="cornelius.css" />
<script type="text/javascript" src="cornelius.js"></script>
{% endhighlight %}

# API

{% highlight javascript %}
var cornelius = new Cornelius( new Date(2012, 06), [options] );
cornelius.draw(data, container);
{% endhighlight %}

## Constructor

The first parameter the constructor takes is a `Date` object which will be used as the initial date
to compute the dates that will be shown in the chart.

This `Date` object should have the `date` part of the object set as the beginning of the month (day 1),
and must have the time set to '00:00'.

{% highlight javascript %}
var date = new Date(2012, 6); // Sun Jul 01 2012 00:00:00
{% endhighlight %}

Be careful with the month argument you pass since the `Date` object considers January as month 0.

## Methods

The only method that an instance of **Cornelius** exposes is the `draw` method, that takes 2 required
parameters.

## Data Format

The first parameter the `draw` method takes is as an array of arrays whose values will be mapped to the cohort table cells in the same order as provided. Given the distinctive triangle shape of the chart, each array should either have a value less than the previous one, or it should be filled with `null`, `undefined`, or `false` values.

## Container

The second parameter it takes in a DOM element where the table will be inserted as a child element.

# Options

Cornelius accept any of these option values passed to the constructor:

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

It is possible to customize the colors of the cells depending on the percentage each of those have.
You will have to specify the class names and the percentage ranges the library will use to decide which class
will assign to each cell.

Below are the default css classes and ranges the library use.

{% highlight javascript %}

var options = {
  repeatLevels: {
    'low': [0, 10],
    'medium-low': [10, 20],
    'medium': [20, 30],
    'medium-high': [30, 40],
    'high': [40, 60],
    'hot': [60, 70],
    'extra-hot': [70, 100]
  }
}

new Cornelius(initialDate, options).draw(...);
{% endhighlight %}

In this example, Cornelius will assign the `cornelius-low` class to each cell with a value between 0%
and 10%, `cornelius-medium-low` to each cell between 10% and 20%, and so on.

You can specify as many ranges and class names as you want, but don't forget to add those classes to
your stylesheets.

## drawEmptyCells

Setting this property to `true` will display a white empty cell for those cells that are "outside"
of the main triangle.

Example:
<div id="empty-cells-example"></div>

<script type="text/javascript">
{% include empty_cells_example.html %}
</script>

{% highlight javascript %}
{% include empty_cells_example.html %}
{% endhighlight %}

Default: `true`

## rawNumberOnHover

If `rawNumberOnHover` is set to true, will display the raw number while leaving the mouse on top of a cell.

Default: `true`

## initialMonth

This property will allow you to specify which will be the initial month number to display in the column headers.

Default: `1`

## I18n

The library uses only 3 strings for the labels that can be specified in the options object:

{% highlight javascript %}
new Cornelius(initialDate, {
  labels: {
    time: 'Zeit', // Time
    people: 'Menschen', // People
    weekOf: 'Woche Vom' // Week Of
  }
});
{% endhighlight %}

The short and long month names can also be customized:

{% highlight javascript %}
new Cornelius(initialDate, {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
               'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],

  shortMonthNames: ['Ene', 'Feb', 'Mar', 'Abr', 'Mar', 'Jun', 'Jul',
                    'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
});
{% endhighlight %}

Alternatively you can specify the functions that will be called to return the Strings for the header
and date labels:

## formatHeaderLabel

