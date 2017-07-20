class BaseException(Exception):
    """
    Base exception for steps.
    """
    pass


class StepException(BaseException):
    """
    Base exception for step related errors.
    """
    pass


class StepFailed(StepException):
    """
    Exception to indicate step has failed.
    """
    pass


class RetryStep(StepException):
    """
    Exception to indicate step should be retried.
    """
    pass
