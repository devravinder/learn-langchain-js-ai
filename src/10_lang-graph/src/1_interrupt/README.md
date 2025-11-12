# Interrupt

## [Use cases](https://docs.langchain.com/oss/javascript/langgraph/interrupts#common-patterns)
1. Approval workflows
2. Review and edit
3. Interrupting tool calls
4. Validating human input

// https://docs.langchain.com/oss/javascript/langgraph/interrupts#full-example


## [Interrupt Rules](https://docs.langchain.com/oss/javascript/langgraph/interrupts#rules-of-interrupts)
1. the node which triggered interrupt will re-run again after resume
2. Interrupt internally throws exception, to work interrupt as keep interrupt always outside of try-catch block
3. if multiple interrupts are used in a node, keep them always consistent -  Do not conditionally skip interrupt calls within a node
4. Do not return complex values in interrupt calls
    - Pass simple, JSON-serializable types to interrupt , string, objects
    -  Do not pass functions, class instances, or other complex objects to interrupt

5. Side effects called before interrupt must be idempotent