import graphene


class ErrorType(graphene.ObjectType):
    field = graphene.String()
    message = graphene.String()


def to_errors(form):
    return [
        ErrorType(field=error.field, message=error.message)
        for error in form.errors.items()
    ]
