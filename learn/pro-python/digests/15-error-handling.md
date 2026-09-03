---
source: 15-error-handling.md
source_hash: daf1c16a054943c3db179a52323279e75d75e021e0c30c4fde0832281450f627
source_lines: 2
created: 2025-09-03
updated: 2025-09-03
---

# Digest — 15-error-handling.md

## Overview (L1)

- Exceptions raised when something interrupts normal program flow
- `raise ValueError("message")` to explicitly raise exceptions for validation errors
- `try`/`except` blocks catch specific exceptions; always catch as specifically as possible
- Bare `except:` catches everything including `KeyboardInterrupt` — avoid it
- Custom exceptions: subclass `Exception` class for domain-specific error handling
- Exception handling adds context; don't catch exceptions just to ignore them

## Sections (L2)

### Raising Exceptions
- Locator: [[sources/pro-python/completed/20260903_15-error-handling.md#raising-exceptions]]
- Summary: `raise` keyword to explicitly throw exceptions for validation errors
- Key claims: Raise exceptions when code can't complete safely; `ValueError` for invalid arguments; custom exceptions via subclassing
- Learner-relevant: Knowing when to raise vs. return error values is a key production skill

### Catching Exceptions
- Locator: [[sources/pro-python/completed/20260903_15-error-handling.md#catching-exceptions]]
- Summary: `try`/`except` blocks; catch specific exceptions; avoid bare `except:`
- Key claims: Bare `except:` catches `KeyboardInterrupt` and SystemExit; always specify the exception type; catch as specifically as possible
- Learner-relevant: Proper exception handling prevents silent failures and debugging nightmares in production
