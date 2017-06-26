from colormath.color_objects import LabColor, sRGBColor as RGBColor
from colormath.color_conversions import convert_color

import logging

logger = logging.getLogger(__name__)


class Classifier(object):
    """
    Classifier

    Example:
        >>> classifier = Classifier(rgb=[255, 170, 0])
        >>> classifier.get_name()
        'orange'
    """

    lab = LabColor

    colors = {
        'red': (255, 0, 0),
        'green': (0, 255, 0),
        'blue': (0, 0, 255),
        'yellow': (255, 255, 0),
        'cyan': (0, 255, 255),
        'violet': (255, 0, 255),
        'orange': (255, 170, 0),
        'black': (0, 0, 0),
        'white': (255, 255, 255),
        'brown': (123, 52, 0),
        'gray': (127, 127, 127),
        'lightblue': (173, 173, 255),
        'lightred': (255, 173, 173),
        'lightgreen': (173, 255, 173),
    }

    def __init__(self, **kwargs):
        self.colors_lab = {}

        if kwargs.get('rgb'):
            self.set_rgb(kwargs.get('rgb'))

    def set_rgb(self, rgb):
        """
        Pass an RGB value to the classifier
        """

        rgb = RGBColor(*rgb)
        logger.debug(rgb.get_rgb_hex())

        self.lab = convert_color(rgb, LabColor)
        logger.debug('Saved lab: {lab} from rgb: {rgb}'.format(
            lab=self._lab_to_tuple(self.lab),
            rgb=rgb))

        self._update_lab_colors()

    def _update_lab_colors(self):
        for name, val in self.colors.items():
            self.colors_lab.update({
                name: self._lab_to_tuple(
                    self._rgb_to_lab(list(val)))})

        logger.debug('colors_lab: %1s' % self.colors_lab)

        return True

    def get_name(self):
        """
        Get color name from the classifier.
        """

        (name, values) = min(
            self.colors_lab.items(), key=ColorDistance(
                self._lab_to_tuple(self.lab)))

        return name

    def _lab_to_tuple(self, lab):
        return (lab.lab_l, lab.lab_a, lab.lab_b)

    def _rgb_to_lab(self, rgb):
        rgb = RGBColor(*rgb)
        return convert_color(rgb, LabColor)


class ColorDistance(object):
    """
    Calculates the distance between 3-tuples with numbers

    Example:
    min(
        dict(
            black=(0, 0, 0),
            red=(255, 0, 0),
            blue=(0, 0, 255)
        ).items(),
        key=ColorDistance((255, 0, 0))
    """

    def __init__(self, color):
        self.color = color

    def __call__(self, item):
        return self.distance(self.color, item[1])

    def distance(self, left, right):
        return sum((l - r) ** 2 for l, r in zip(left, right)) ** 0.5
