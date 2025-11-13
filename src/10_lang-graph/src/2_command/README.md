# Command

- command works as both node & edge
  - node can only update state
  - edge can only handle rounting

- it is like conditional edge with state update capabilities
- it can be used in tools to update state
  - [to update state from tools](https://docs.langchain.com/oss/javascript/langgraph/use-graph-api#use-inside-tools)

- to resume the graph after the interrupt

## Command Rules

1. When Command is used node function, we must add the ends parameter when adding the node to graph,
     - to specify which nodes it can route to
