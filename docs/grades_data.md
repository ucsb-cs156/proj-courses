# docs/grades_data.md

This file documents the source of data used for the
`GradeHistoryImportService.java`, which is the part of the code that retrieves the grade history data
displayed for each course.

## How to update grade history data

To update the grade history data take these steps (as illustrated in the screen shot below):
* Login as an admin user
* Select `Manage Jobs`
* Select `Update Grade Info`
* Click the button `Update Grades`

<img width="1212" height="489" alt="image" src="https://github.com/user-attachments/assets/7d40e3f5-22c1-4c49-8263-1a9d4a2ee9e2" />

The grade job will show output as the grade data is uploaded, as shown below.  It will initially say `running` for the status, and should eventually show `complete`.

<img width="769" height="295" alt="image" src="https://github.com/user-attachments/assets/ea7eea3f-7316-4888-9237-00ce568edf05" />

The full output should end with lines like these:

```
Processed 494633 grade history records so far.
Processed 495097 grade history records. Done!
Finished updating UCSB Grade History Data
```

## Source of the Data

As of the date when this file was written (01/07/2026), UCSB's student run newspaper, [The Daily Nexus](https://dailynexus.com/), maintained a Github Repo at <https://github.com/dailynexusdata/grades-data> containing grade data for UCSB courses from 2009 to 2025.

This data is obtained via Freedom of Information Act requests, as described in the README.md file of the repo referenced above.

## Format of the data

The data is read directly from the file 
* <https://github.com/dailynexusdata/grades-data/blob/main/courseGrades.csv> 

via the raw url: 

* <https://raw.githubusercontent.com/dailynexusdata/grades-data/refs/heads/main/courseGrades.csv>

The header line of the CSV has this format:

```
course,instructor,quarter,year,A,B,C,D,F,nLetterStudents,nPNPStudents,avgGPA,P,dept,S,su,Ap,Bp,Cp,Dp,Am,Bm,Cm,Dm,IP
```

With this interpretation:

| Field | Explanation |
|-|-|
| `course` |  Course, e.g. `WRIT    501B` |
| `instructor` |  Instructor, e.g. `DEAN C W` |
| `quarter` | Quarter, one of `Fall`, `Winter`, `Spring`, `Summer`  |
| `year` | Year (e.g. `2009`)  |
| `A` |  Number of A grades  |
| `B` |  Number of B grades |
| `C` |  Number of C grades  |
| `D` |  Number of D grades |
| `F` |  Number of F grades |
| `nLetterStudents` |  Number of letter graded students  |
| `nPNPStudents` | Number of P/NP students  |
| `avgGPA` | Average of grades in class computed as GPA  |
| `P` | Number of P grades for P/NP students.  |
| `dept` |  Department code (e.g. `WRIT`) |
| `S` |  Number of S grades for S/U graded classes |
| `su` | Number of U grades for S/U graded classses  |
| `Ap` | Number of A+ grades  |
| `Bp` | Number of B+ grades  |
| `Cp` | Number of C+ grades  |
| `Dp` | Number of D+ grades   |
| `Am` | Number of A- grades   |
| `Bm` | Number of B- grades   |
| `Cm` | Number of C- grades   |
| `Dm` | Number of D- grades   |
| `IP` | Number of In Progress (IP) grades |

# How the grade data is imported

There is a job that can be run on demand by anyone with an Admin account that will retreieve the
data from this file.   Use the `Admin` menu, then `Manage Jobs`, then select `Upload Grade Data`.

The background job `UploadGradeDataJob` uses the `GradeHistoryImportServiceImpl` service which
uploads grade data, processing via SQL queries for efficiency.   The SQL query is called whenever
the number of pending records to update exceeds 1000.  

There is a tradeoff here between memory usage and computational efficiency.  

As of January 2026, the file is currently 9.0 MB of data, over 100K lines, and represents over 495K individual records that need to be written to the SQL database; these numbers will continue to grow over time.

This presents some scaling challenges:

* Reading the entire file into memory before starting to write to the SQL database is likely not a good implementation choice
* Writing one record at a time to the SQL database is likely to be slow

We chose a tradeoff, using a `BATCH_SIZE` currently set to 1000 via this line of code in `UploadGradeDataJob`:

```java
  private static final int BATCH_SIZE = 1000;
```

Grades are read from the file one line at a time, and converted into GradeHistory objects stored in a list in memory. Whenever the size of this list exceeds `BATCH_SIZE`, the records are stored in a single
SQL operation.

This can be seen in the output of the job; for example:

```
Updating UCSB Grade History Data
Processed 1005 grade history records so far.
Processed 2008 grade history records so far.
Processed 3014 grade history records so far.
Processed 4018 grade history records so far.
Processed 5021 grade history records so far.
```

[Many lines omitted here]

```
Processed 493630 grade history records so far.
Processed 494633 grade history records so far.
Processed 495097 grade history records. Done!
Finished updating UCSB Grade History Data
```

If the time required to load the data starts to become excessive, the batch size could be adjusted
experimentally to determine an optimal value.
