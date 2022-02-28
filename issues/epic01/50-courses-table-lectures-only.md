Courses Table for Lectures Only

The structure of UCSB Courses Data is complex; the JSON includes a top level object
for the "primary" (typically a lecture in courses that have discussion sections), and 
optionally, a list (array) of one or more "secondaries" (i.e. discussion sections, labs).

In this Sprint, we are going to ignore the sections.

I repeat, we are IGNORING THE SECTIONS.

Just look at the top level primaries, and make a simple table component
that can take an array of the courses objects returned from the UCSB api for the Curriculum,
and will display the most relevant fields, i.e. these:

* `"quarter": "20222",`
* `"courseId": "ANTH      2  ",`
* `"title": "INTRO CULT ANTHRO",`
* `"description": "The nature of culture: survey of the range of cultural phenomena, including material culture, social organization, religion, and other topics.",`
* `"objLevelCode": "U",`
* `"subjectArea": "ANTH    ",`
* `"unitsFixed": 4,`

Note that for the description field, you may need to cut it off after a certain number of characters rather than displaying the entire thing.  It is customary to put `...` if you have
cut off the description in this way.

Come up with your own acceptance criteria.
