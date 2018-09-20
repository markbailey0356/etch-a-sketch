# The Magna-doodle project

This project is based upon the [*Etch-a-Sketch* Project](https://www.theodinproject.com/lessons/etch-a-sketch-project)
from [**The Odin Project**](https://www.theodinproject.com) curriculum.

The final result can be found here: [The Magna-doodle project](https://markbailey0356.github.io/etch-a-sketch/)

I'll admit that I got a little bit carried away with this one when I realised that the brief has more in common with the
old Magna-doodle than the Etch-a-sketch. I had one when I was young, so naturally, I went and made it look like a
Magna-doodle instead -- with just a touch of added functionality.

The result represents almost 50 hours of work and my first truly polished web application. In making this, I used pretty
much everything I have learnt up until this point. Needless to say, I have very proud of it.

The sections below represent a journal of my progress implementing each of the major features.

As with all projects, it's not really finished, but it's about time I moved on. I'm sure I will continue to add to this
project as I continue to learn.

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

## Subtractive color mode

The solution to my previous problem of trying to get colours to mix together was to adopt an additive colour model; this
meant that I had to start with a black background. However, if I wanted to make it look like a magna-doodle, then I
would need to change the color model to subtractive. Rather than just change the necessary constants, I made functions
to clear the grid and switch the color model between being additive and subtractive.

Furthermore, I had to change a couple of user interface items between the modes as well; such as swapping the effects of
the two mouse buttons, and changing the labels on the pen color buttons.

## Magna-doodle frame

The next step was to style the grid so that it displays inside a frame that looks like the original magna-doodle. This
was as simple as a containing frame `div` with some appropriate css properties. I was surprised at what you could do
aesthetically with just a list of `box-shadow` properties.

I also wanted the frame to be re-positionable by clicking and dragging the frame. This turned out to be possible by
setting the frame to `draggable="true"` in the HTML and implementing `dragstart` and `dragend` event listeners.
Unfortunately, this had the unwanted side effect of making the frame drag when clicking to draw on the grid, which is a
child of frame. I figured that this should have been able to be prevented by checking the `target` properties of the
drag events and calling `preventDefault()` if the target is the grid. This, however, wasn't working.
Counter-intuitively, the solution to this was to also set `draggable="true"` on the grid container as well, so that the
drag events would fire when the grid was the `target` and `preventDefault()` could be called accordingly.

Now, I just have to integrate the buttons into the frame...

## Button integration

This step turned out to be the most time-consuming; mainly due to my demanding expectations of how the controls should
be styled.

### Clear slider

I started with the classic magna-doodle clear slider; the one that runs along the bottom of the frame and clears the screen. The slider
consists of a containing frame `div`, inside which are `div`s for the track and handle. Making careful use of the `box-shadow`
property allowed me to style the slider's frame to make the slider look recessed. I also needed to use a trapezoidal shaped
pseudo-element to hide the existing shadow from the magna-doodle frame.

As far as responding to input, sliders normally allow both clicking and dragging the handle, or making the handle jump to the mouse if the user clicks
the track. In this case, I only wanted the former functionality to make it feel like the real thing. This was achieved
by attaching a `mousedown` listener to the handle to start the movement, then `mousemove` and `mouseup` listeners to
`window` to update and stop the movement. It was important for these latter listeners to be on `window` for the movement
to continue even if the user moves the mouse vertically outside of the handle while still dragging.

Once the slider was responding to input, I made the `mousemove` listener record how far the slider moves between updates
and clear the appropriate columns of the grid accordingly. Writing the function to clear the grid required me to create
a data structure to hold references to the cells. This data structure could then be populated when creating the grid,
grouping cells by their containing columns. Clearing a particular columns just involves retreiving the column group and
iterating over its cell members.

### Mode switches

This magna-doodle has a few more features than the real one, such as being able to invert the colour mode, change to a
square grid, or toggle the grid-lines. I decided to integrate these alternate modes by adding some toggles switches
along the top of the frame. Outside of styling, the switches needed no more functionality than the `click` events that I already had attached to the
respective buttons.

The styling required much more attention to integrate them into the frame and to make them visably toggle when clicked.
Each switch is made up in a similar fashion to the clear slider: a containing frame with a switch handle. The majority
of the styling was done through CSS, the only exception being the requirement to toggle a `.toggled` class to the switches in
the `click` event listeners. This `.toggled` class moves the switch and highlights the label for the active mode. Using
the `transition` property, I was able to animate the movement of the sliders, and I used a `setTimeout` callback to
switch the mode once the animation was complete.

I made one further change to the effect of changing the color mode. Instead of instantly changing the entire screen, I
wanted the effect to ripple over the screen. I made use of the new grid columns that I had implemented while creating the
clear slider. The function itself employs a recursive callback, inverting one columns then calling itself on the next
column after setting a delay using `setTimeout()`. 

One complication was to do with the grid-lines; they aren't actually the borders of the cells but gaps between the
cells that leak the underlying grid's `background-color`. Changing the colour of these using CSS transitions would occur
across the whole grid all at once. This would have likely been fine, but the added processing made the whole effect lag.
It turned out to be possible to create a new underlying grid background in the new colour and extend it's width along
with the rippling effect of the cells. The result was both more performant and more aesthically pleasing.

### Color trays

These switches are quite functionally very similar to the mode switches, but with major differences in styling. I wanted
to attempt to have a color "tray" for each different color that would slide out of the frame when moused over. Upon
toggling, they tray would snap to fully open and stay open until a new color is selected.

I took this opportunity to remove some of the duplicated code that I used when creating the original color buttons.
Instead of creating listeners individually with slight differences, I added the listener to the buttons' container. Upon
triggering the event, the color is set according to the value of a HTML attribute on the target tray called
`data-color`.

Other than that, it was at this time that I discovered `display: flex` and used that to evenly space the trays along the
right-hand side of the frame.

### Opacity slider

Aside from styling differences, the opacity slider functions very similar to the clear slider. The one exception is
that, in this case, I wanted to implement the functionality where the handle would snap to the mouse of the user clicked
on the track (instead of the handle). This required minor changes to the `mousedown` event listener. At the moment, I
haven't generalised the two sliders to have the same listeners like I have done with the switches and trays -- so there
is a lot of ugly duplicated code here.

## To-do list

I have some further ideas to implement:

* Reposition frame on window resize
* Make frame resizable
