## Avoiding Common Attacks

1. Using Specific Compiler Pragma: Check.

2. Proper Use of Require, Assert and Revert: Check.

3. Use Modifiers Only for Validation: Check.

4. Pull Over Push: Does not apply.

5. Checks-Effects-Interactions: Check.

6. Proper use of .call and .delegateCall: Does not apply.

7. Frontrunning: It might be used to somehow hack the pseudo-randomness of the game, but even if it's possible it would be very limited, making it irrelevant in the author's opinion.

8. Timestamp Dependence: Check.

9. Network Stuffing DoS: Represent a problem to active players if the network is stuffed for long periods.

10. Forcibly Sending Ether: Does not apply.

11. Block Gas Limit DoS: Does not apply.

12. Reentrancy: Does not apply.

13. Integer Under / Overflow: Check. In the case of requestCounter, submitCounter and feedCounter the overflow is allowed and will keep the game running even if these variables ever get to the highest possible number.

14. Unexpected Revert DoS: Does not apply.

15. tx.origin Authentication: Does not apply.