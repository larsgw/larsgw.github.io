This readme is for a not yet finished project, just to test out the markdown
============================================================================

Description
===========

converts all your BibTeX and JSON to BibTeX, JSON and HTML in your very own webbrowser! You can now even implement in to your own page.

Use
===

Call the function `citate()` with the parameters as listed [below](#input). The ouput is dependant of the second and third parameter. See [Input](#input) and [Output](#output) for input and output.

<a name="input">
# Input
</a>

1. In the first parameter you pass the string, object or array of objects you want to convert
2. In the second you pass the ouput type, as listed in the section Output
3. In the third, you pass the language. Currently Dutch ("nl") and English ("en") are supported. BibTeX ouput doesn't support other languages than English.

## BibTeX

In the BibTeX-part of the input you simply pass a string of a citation in BibTeX-format. For the BibTeX documentation, see [wikipedia](https://en.wikipedia.org/wiki/BibTeX#Bibliographic_information_file). See [Output](#output) for the output.

<a name="json">
## JSON
</a>

In the JSON-part of the input you pass an object or the string of an object. Your JSON may be "relaxed"; You needn't worry about double quotes around every single key. Properties are specified below. Note that not all properties are supported for all types. See [Output](#output) for the output.

* `type`: the type of citation. May be "book", "chapter", "article", "e-article", "e-publication", "paper" or "newspaper-article"
* `author`: the author(s), listed in an array. Names don't have to be formatted
* `red`: the editor(s), listed in an array. Names don't have to be formatted
* `chapterauthor`: the authors of the chapter. Names don't have to be formatted
* `title`: the title of the book, publication, etc
* `chapter`: the title or number of the chapter
* `pages`: the pagenumbers of the citated fragment, listed as integers in an array
* `year`: year of publication, as an integer
* `pubdate`: object containin following properties, concerning the date of publication
  * `from`: date of publication, format dd-mm-yyyy, listed as integers in an array
* `date`: object containin following properties, concerning the date of citation
  * `from`: date of citation or date of start of conference, format dd-mm-yyyy, listed as integers in an array
  * `to`: date of end of conference, format dd-mm-yyyy, listed as integers in an array
* `url`: URL of publication
* `con`: object containin following properties, concerning the conference where the thing was presented
  * `name`: name of conference
  * `org`: name of organisation where conference was held
  * `place`: place where conference was held
  * `country`: country where conference was held
  * for the date of the conference, use `date` (outside of the `con` object)
* `journal`: journal the thing is published in
* `volume`: the volume of the journal the thing is published in
* `number`: the number of the journal the thing is published in 
* `place`: the place(s) of publication, listed in an array
* `publisher`: the publisher as a string

<a name="output">
# Ouput
</a>

* BibTeX: Outputs a single string of a citation in BibTeX-format. Specify as "BibTeX". For the BibTeX documentation, see [wikipedia](https://en.wikipedia.org/wiki/BibTeX#Bibliographic_information_file).
* JSON: Outputs an object with properties as specified in [Input/JSON](#json). Specify as "JSON".
* HTML: Outputs a string of several HTML elements, containing your formatted citation, in the following styles.
  * Vancouver style; specify as "Vancouver"
  * APA style; specify as "APA"

Examples
========

* An example can be found at []()
* The official website, however, can be found at [larsgw.github.io/APA.html](larsgw.github.io/APA.html). This contains more support like input via webforms.

Dependencies
============

* jQuery
* BibTeXParser

These, however, are inbuilt.
