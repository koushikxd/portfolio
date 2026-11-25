# Dithered koi pond

The footer pond uses the same visual style as the banner shader. A brightness field (water swells, ripples, koi, lily pads) is thresholded through a 4x4 Bayer matrix and drawn as square dots on a canvas. Each koi swims a figure-eight path (x on `sin t`, y on `sin 2t`) and faces along the path's tangent. Pond positions are fractions of the pond size, and sizes are in cells.

The loop runs at 30fps and only while the pond is on screen. With reduced motion it draws one still frame, redrawn each time the pond comes into view, so a theme switch is picked up.
