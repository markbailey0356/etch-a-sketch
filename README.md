# etch-a-sketch

A project to build an Etch-a-Sketch-like app that colours grid squares on the page when moused-over. This is part of
[*The Odin Project*'s curriculum](https://www.theodinproject.com/lessons/etch-a-sketch-project).

## Additive colours

The first difficult challenge of this project so far was to get the different colours to add together. I wanted to be
able to mix colours together, so it wasn't enough for me to just overwrite them; instead, I had to read the background
colour and add to it. The issue I had was mainly due to a lack of understand of the difference between an additive and a
subtractive colour model. Starting with the background white, I would have needed to use a subtractive model, but I got
stuck trying to make it work properly instead. Once I changed the background to black and used an additive model, it
worked fine.

## Hexagonal Grid

I realized that this project is actually more like a Magna-doodle than an Etch-a-Sketch; so, I got the idea to try and
make the grid hexagonal. In the classic nature of programming, that was a lot harder than I thought.

First, I had to make hexagonal divs. I was imagining some-how taking each corner off of a rectangle and making them
transparent in such a way to form a solid hexagonal shape. Googling around led me to [this amazing
page](https://css-tricks.com/examples/ShapesOfCSS/) on **CSS Tricks** about how to make different shaped divs in CSS.
Making the hexagon required taking a rectangle and adding triangular `:before` and `:after` elements to each side.
Triangular elements could be made by first making the element have zero `width` and `height`, then using a combination
of thick colored and transparent borders on adjacent sides to form a triangle. As regular hexagons don't actually have
nice rational dimensions, I started to use CSS custom properties (i.e. CSS variables) and `calc()` to calculate the
correct dimensions.

It turned out that CSS custom properties are insanely useful and they were integral to being able to being able to
change the hex-cells' colors. The javascript would need to change the colour of all three elements of each cell
individually. However, you could set the inner elements to grab their colour from a custom property on the parent. I
would only need to change this property in order to change the whole hexagon's color.

It now occurs to me that I could have just set the inner elements to `background-color: inherit` to solve the coloring
problem, but the custom properties did do something for me that `inherit` couldn't do. I was able to set up a custom
property to hold the default background colour of the cells. This would then get over-ridden when I set the individual
cells' colors using JS.

Once I figured out how to place these hexagons and set their dimensions using JS, I was able to use a couple nested
`for`s to create a static grid. With a bit of maths, I was able to dynamically size the hex's to create a grid with a
set number of cells in height that fit inside the grid's dimensions.

I needed to find a way to clip overflowing hexagons around the grid's perimeter, or else I would need to clip them
myself (which I didn't want to do). I originally thought to use an over-lapping frame element that would lie around the
perimeter. However, it turned out to be much easier than that due to the CSS `overflow: none` property.

Now, if I wanted to make the hex-grid look like a real magna-doodle, then I would need borders around the hex
elements. That, however, was complicated by the fact that my hexagons were actually three elements; two of these were
already using their `border` property to draw the triangles. I eventually hacked together a solution by shrinking each
hexagon by a small amount so that the background would show in between them.

After all that, it was simple matter to generalise the drawing functions to allow them to change the colors of both the
square cells and the hexagonal ones. I also added a couple buttons to allow you to choose which grid to redraw and at
what resolution.

## To-do list

I have some further ideas to implement: (in order to anticipated difficulty)

* Add the ability to be able to switch between additive and subtractive mode
* Style the grid to appear within a picture of a Magna-doodle
* Implement click-and-drag on the Magna-doodle frame
* Clear the screen by shaking the frame back-and-forth
