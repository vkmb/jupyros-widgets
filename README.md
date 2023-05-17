# jupyros-widgets

Implemention of jupyros

## Installation

To install use pip:

    $ pip install jupyros_widgets

For a development installation (requires [Node.js](https://nodejs.org) and [Yarn version 1](https://classic.yarnpkg.com/)),

    $ git clone https://github.com//jupyros-widgets.git
    $ cd jupyros-widgets
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --overwrite --sys-prefix jupyros_widgets
    $ jupyter nbextension enable --py --sys-prefix jupyros_widgets

When actively developing your extension for JupyterLab, run the command:

    $ jupyter labextension develop --overwrite jupyros_widgets

Then you need to rebuild the JS when you make a code change:

    $ cd js
    $ yarn run build

You then need to refresh the JupyterLab page when your javascript changes.
