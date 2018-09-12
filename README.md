# etch-a-sketch

A project to build an Etch-a-Sketch-like app that colours grid squares on the page when moused-over. This is part of
[*The Odin Project*'s curriculum](https://www.theodinproject.com/lessons/etch-a-sketch-project).

The most difficult challenge of this project so far was to get the different colours to add together. I wanted to be
able to mix colours together, so it wasn't enough for me to just overwrite them; instead, I had to read the background
colour and add to it. The issue I had was mainly due to a lack of understand of the difference between an additive and a
subtractive colour model. Starting with the background white, I would have needed to use a subtractive model, but I got
stuck trying to make it work properly instead. Once I changed the background to black and used an additive model, it
worked fine.

I have some further ideas to implement: (in order to anticipated difficulty)

* Click to draw
* Add the ability to be able to switch between additive and subtractive mode
* Implement a hex-grid like a traditional Magna-doodle (I know... its supposed to be an Etch-a-sketch, but the brief is
  actually more like a Magna-doodle)
* Style the grid to appear within a picture of a Magna-doodle
* Implement click-and-drag on the Magna-doodle frame
* Clear the screen by shaking the frame back-and-forth