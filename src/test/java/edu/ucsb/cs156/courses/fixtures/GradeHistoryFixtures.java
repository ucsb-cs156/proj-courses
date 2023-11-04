package edu.ucsb.cs156.courses.fixtures;

public class GradeHistoryFixtures {
  public static final String GITHUB_API_SAMPLE_JSON =
      """
        {
            "sha": "c5535a56190265628f39b84702f51b4aa73edb73",
            "url": "https://api.github.com/repos/ucsb-cs156/UCSB_Grades/git/trees/c5535a56190265628f39b84702f51b4aa73edb73",
            "tree": [
              {
                "path": ".gitignore",
                "mode": "100644",
                "type": "blob",
                "sha": "b296010c8302bfc9179113f9f422612594d94685",
                "size": 18,
                "url": "https://api.github.com/repos/ucsb-cs156/UCSB_Grades/git/blobs/b296010c8302bfc9179113f9f422612594d94685"
              },
              {
                "path": "README.md",
                "mode": "100644",
                "type": "blob",
                "sha": "dcf7a0ec30a49c335d8f1458b4c4c347be52706a",
                "size": 639,
                "url": "https://api.github.com/repos/ucsb-cs156/UCSB_Grades/git/blobs/dcf7a0ec30a49c335d8f1458b4c4c347be52706a"
              },
              {
                "path": "UCSB Grades.csv",
                "mode": "100644",
                "type": "blob",
                "sha": "499ef6093be9b35057e68c0e80e549d71a06a119",
                "size": 18869547,
                "url": "https://api.github.com/repos/ucsb-cs156/UCSB_Grades/git/blobs/499ef6093be9b35057e68c0e80e549d71a06a119"
              },
              {
                "path": "make_csvs.py",
                "mode": "100644",
                "type": "blob",
                "sha": "045edc988872819a2dae51967103e6deac384c7a",
                "size": 3950,
                "url": "https://api.github.com/repos/ucsb-cs156/UCSB_Grades/git/blobs/045edc988872819a2dae51967103e6deac384c7a"
              },
              {
                "path": "quarters",
                "mode": "040000",
                "type": "tree",
                "sha": "8d79f603ad8e2bb38802b31457ed052a8d431c72",
                "url": "https://api.github.com/repos/ucsb-cs156/UCSB_Grades/git/trees/8d79f603ad8e2bb38802b31457ed052a8d431c72"
              },
              {
                "path": "quarters/F09",
                "mode": "040000",
                "type": "tree",
                "sha": "61090a24c0504aedf4bb61095af03b66aa8b5e16",
                "url": "https://api.github.com/repos/ucsb-cs156/UCSB_Grades/git/trees/61090a24c0504aedf4bb61095af03b66aa8b5e16"
              },
              {
                "path": "quarters/F09/ANTH.csv",
                "mode": "100644",
                "type": "blob",
                "sha": "1e0a1ba0f8601a13fdfec662af2dbc1def33506c",
                "size": 4381,
                "url": "https://api.github.com/repos/ucsb-cs156/UCSB_Grades/git/blobs/1e0a1ba0f8601a13fdfec662af2dbc1def33506c"
              }
            ]
        }
    """;

  public static final String SAMPLE_CSV_FILE_CONTENTS =
      """
        Quarter,Course Level,Course,Instructor,Grade Given,Sum of Student Count
        F09,Undergraduate,DANCE    47A,HUSTON V G,A-,3
        F09,Undergraduate,DANCE    47A,HUSTON V G,C+,1
        F09,Undergraduate,DANCE    51,STUNKEL M C,A,8
        F09,Undergraduate,DANCE    51,STUNKEL M C,B-,1
        """;
}
