Implement a Subject Selector Components

There is already component that allows you to select a quarter from a dropdown menu;
it appears in the Storybook and has full test coverage.

Add an additional component that allows you to select a UCSBSubject.  Populate it
from a list of subjects from the backend endpoint in the UCSBSubjectController
that gives a list of all the UCSBSubjects in the database.

You can use code from the S21 proj-ucsb-courses-search.

If it makes things easier, you may put in CMPSC as a hard coded "default" subject
that is used if/when the UCSBSubjects table is empty.  But this is not
required; this is just a way to handle things if an empty table leads to hard to
debug errors, or makes testing harder.

DEFINE SUITABLE ACCEPTANCE CRITERIA

