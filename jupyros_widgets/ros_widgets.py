import ipywidgets as widgets
from traitlets import Unicode
from ._version import NPM_PACKAGE_RANGE


@widgets.register
class ROSConnection(widgets.DOMWidget):
    """An example widget."""
    _model_name = Unicode('ROSModel').tag(sync=True)
    _view_name = Unicode('ROSView').tag(sync=True)
    _model_module = Unicode('jupyros-widgets').tag(sync=True)
    _view_module = Unicode('jupyros-widgets').tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    socket_url = Unicode('ws://localhost:8888/ros/bridge').tag(sync=True)