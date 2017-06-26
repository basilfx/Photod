class Node(object):
    def __init__(self, instance, name, depends):
        self.instance = instance
        self.name = name
        self.depends = depends


def format_dependencies(name_to_deps):
    msg = []
    for name, deps in name_to_deps.items():
        for parent in deps:
            msg.append("%s -> %s" % (name, parent))
    return "\n".join(msg)


def format_nodes(nodes):
    return format_dependencies({node.name: node.depends for node in nodes})


def get_batches(nodes):
    """
    """

    # Build a map of node names to node instances.
    instances = {node.name: node for node in nodes}

    # Build a map of node names to dependency names.
    dependencies = {node.name: set(node.depends) for node in nodes}

    # Store for the batches.
    batches = []

    while dependencies:
        # Get all nodes with no dependencies.
        ready = {
            name for name, dependency in dependencies.items() if not dependency
        }

        # If there aren't any, we have a loop in the graph.
        if not ready:
            raise ValueError("Circular dependencies: %s" % (
                format_dependencies(dependencies)))

        # Remove them from the dependency graph
        for name in ready:
            del dependencies[name]

        for dependency in dependencies.values():
            dependency.difference_update(ready)

        # Add the batch to the list
        batches.append({instances[name] for name in ready})

    return batches
