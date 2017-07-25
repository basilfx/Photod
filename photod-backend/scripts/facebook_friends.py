from bs4 import BeautifulSoup

import sys


def main():
    """
    Create a fixture of Facebook friends using exported profile data.

    You can use this script to bootstrap your database with persons.
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


# E.g. `python facebook_friends.py /path/to/facebook/export/friends.htm`
if __name__ == "__main__":
    sys.exit(main())
