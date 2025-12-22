# Teacher's Guide: Proving Parallelograms Explorer

## Educational Goals

This tool is designed to support the **Common Core State Standards for Mathematics**, specifically **HSG-CO.C.11**:
*Prove theorems about parallelograms. Theorems include: opposite sides are congruent, opposite angles are congruent, the diagonals of a parallelogram bisect each other, and conversely, rectangles are parallelograms with congruent diagonals.*

## Activity Ideas

### 1. Exploration & Discovery
**Goal:** Students discover the sufficient conditions for a parallelogram.
*   **Prompt:** "Try to make a parallelogram on the screen. Watch the checklist on the right. Can you make a parallelogram that satisfies only *one* of the conditions but not others? Why or why not?"
*   **Discussion:** Lead students to realize that these properties are interlinked. You cannot have both pairs of opposite sides parallel without them also being congruent.

### 2. "Break the Shape"
**Goal:** Understand the sensitivity of geometric definitions.
*   **Prompt:** "Use the 'Snap to Parallelogram' button to start with a perfect shape. Then, move one vertex just slightly. Which properties fail first? Do they all fail at once?"

### 3. The "One Pair" Special Case
**Goal:** Focus on the less intuitive theorem.
*   **Prompt:** "Focus on the last condition: *One pair of opposite sides is both parallel and congruent*. Try to construct a shape where one pair is parallel, but the *other* pair is congruent (Isosceles Trapezoid). Does this make a parallelogram?"

## The 5 Proof Conditions

The tool verifies a parallelogram if **ANY** of the following are true:

1.  **Definition of Parallelogram**: Both pairs of opposite sides are parallel ($m_{AB} = m_{CD}$ and $m_{BC} = m_{DA}$).
2.  **Opposite Sides Theorem**: Both pairs of opposite sides are congruent ($AB = CD$ and $BC = DA$).
3.  **Opposite Angles Theorem**: Both pairs of opposite angles are congruent ($\angle A = \angle C$ and $\angle B = \angle D$).
4.  **Diagonals Theorem**: The diagonals bisect each other (Midpoint of $AC$ = Midpoint of $BD$).
5.  **One Pair Theorem**: One pair of opposite sides is both parallel and congruent (e.g., $AB \parallel CD$ AND $AB \cong CD$).

## Technical Notes for Teachers

- **Precision**: The tool uses a small "fuzziness" factor (epsilon) to allow for human imperfection when dragging with a mouse. It doesn't require pixel-perfect precision to trigger a "Success".
- **Reset**: The "Reset Shape" button restores a random non-parallelogram quadrilateral to encourage students to "fix" it themselves.
