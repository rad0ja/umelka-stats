# Umelka Stats

Stats for a casual weekly football group: every match splits the players into two teams, and the app records the score and who scored or assisted, then derives leaderboards from that.

## Language

### Matches

**Match**:
One game on one evening between **Team A** and **Team B**, with a final score and per-player goals and assists.
_Avoid_: Game, session

**Board**:
The whiteboard where the score (and usually the scorers) is tallied by hand during a **Match**; the original record of what happened.
_Avoid_: Tabule, scoreboard

**Board photo**:
A photo of the **Board** taken at the end of a **Match**, attached to that match as evidence for its recorded score.
_Avoid_: Match image, picture, attachment

### Seasons

**Hidden stats**:
The stretch before a season finale when standings are deliberately scrambled so nobody knows the real order until the last match.
_Avoid_: Masked mode, secret mode

## Relationships

- A **Match** is first tallied on the **Board**, then transcribed into the app
- A **Match** has at most one **Board photo**; taking a new one replaces the old
- A **Board photo** belongs to exactly one **Match**
- A **Board photo** is optional: it can be attached when the **Match** is saved or any time later
- During **Hidden stats**, **Board photos** are still collected but not shown, since they'd reveal the real tallies

## Example dialogue

> **Dev:** "Someone says the 7:6 from last Thursday was really 6:6 — what do we check?"
> **Domain expert:** "Open that **Match**'s **Board photo** and compare it with what was transcribed."
