# Base64 encoded fonts

In order to generate svgs with the right fonts, the fonts themselves must be embedded in the svg file

This is possible by using @font-face and passing a base64 encoded version of the font data.

To create this base64 encoded version of the font data, first download the font from google fonts, and then use https://transfonter.org/ to generate the @font-face statement with the base64 data encoded.
