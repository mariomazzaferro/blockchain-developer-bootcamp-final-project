## Avoiding Common Attacks

Since the project has a lean functionality there is almost no attack vector that applies here. Nevertheless the necessary protections have been implemented.

1. Using Specific Compiler Pragma: Yes, specific compiler pragma 0.8.0 used in contracts to avoid accidental bug inclusion through outdated compiler versions.

2. Proper Use of Require, Assert and Revert: Yes, require() used inside a modifier.

3. Use Modifiers Only for Validation: Yes, validOldId() modifier was used exclusively for validation.

4. Pull Over Push: Does not apply, Prompts.sol makes no external contract calls.

5. Checks-Effects-Interactions: Does not apply, Prompts.sol makes no external contract calls.

6. Proper use of .call and .delegateCall: Does not apply, Prompts.sol makes no external contract calls.

7. Frontrunning: Does not apply.

8. Timestamp Dependence: Does not apply.

9. Network Stuffing DoS: Does not apply.

10. Forcibly Sending Ether: Does not apply.

11. Block Gas Limit DoS: Does not apply.

12. Reentrancy: Does not apply.

13. Integer Under / Overflow: Yes (SafeMath is generally not needed starting with Solidity 0.8, since the compiler now has built in overflow checking.).

14. Unexpected Revert DoS: Does not apply.

15. tx.origin Authentication: Does not apply.