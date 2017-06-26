from bs4 import BeautifulSoup

import sys


def main():
    """
    Take Facebook friends list in JSON format and convert it to fixture.
    """

    soup = BeautifulSoup(open(sys.argv[1]), "html.parser")

    for friend in soup.select("div.contents ul")[0].select("li"):
        name = friend.text

        if "(" in name:
            name = name[:name.index("(")].strip()

        if "[" in name:
            name = name[:name.index("[")].strip()

        sys.stdout.write(
            "- model: core.person\n  fields: {name: %s}\n" % name
        )


if __name__ == "__main__":
    sys.exit(main())
