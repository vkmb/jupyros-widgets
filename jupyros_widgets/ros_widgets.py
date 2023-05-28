import ipywidgets as widgets
from traitlets import Unicode, Bool, Int, Set, Instance, Float, Dict
from ._version import NPM_PACKAGE_RANGE

module_name = 'test-widget'
ws_url = 'ws://localhost:8888/ros/bridge'

@widgets.register
class ROSConnection(widgets.DOMWidget):
    global module_name, ws_url
    _model_name = Unicode('ROSModel').tag(sync=True)
    _view_name = Unicode('ROSView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    socket_url = Unicode(ws_url).tag(sync=True)
    status = Unicode('Initialized', read_only=True).tag(sync=True)

@widgets.register
class Subscriber(widgets.DOMWidget):
    global module_name, ws_url
    _model_name = Unicode('SubscriberModel').tag(sync=True)
    _view_name = Unicode('SubscriberView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    
    widget_height = Int(300).tag(sync=True)
    topic_name = Unicode('/listener').tag(sync=True)
    msg_type = Unicode('std_msgs/String').tag(sync=True)
    subscribed_status = Bool(False, read_only=True).tag(sync=True)
    start_listening = Bool(True).tag(sync=True)
    ros_connection = Instance(ROSConnection).tag(sync=True, **widgets.widget_serialization)


@widgets.register
class Viewer(widgets.DOMWidget):
    global module_name, ws_url
    _model_name = Unicode('ViewerModel').tag(sync=True)
    _view_name = Unicode('ViewerView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    
    width = Int(800).tag(sync=True)
    height = Int(600).tag(sync=True)
    objects = Set().tag(sync=True)

@widgets.register
class TFListener(widgets.DOMWidget):
    global module_name, ws_url
    _model_name = Unicode('TFListenerModel').tag(sync=True)
    _view_name = Unicode('TFListenerView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    
    widget_height = Int(300).tag(sync=True)
    subscribed_status = Bool(False, read_only=True).tag(sync=True)
    fixed_frame = Unicode("world").tag(sync=True)
    angular_thres = Float(0.01).tag(sync=True)
    translation_thres = Float(0.01).tag(sync=True)
    ros_connection = Instance(ROSConnection).tag(sync=True, **widgets.widget_serialization)

@widgets.register
class URDFViewer(widgets.DOMWidget):
    global module_name, ws_url
    _model_name = Unicode('URDFViewerModel').tag(sync=True)
    _view_name = Unicode('URDFViewerView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    ros_connection = Instance(ROSConnection).tag(sync=True, **widgets.widget_serialization)
    tf_client = Instance(TFListener).tag(sync=True, **widgets.widget_serialization)
    viewer3d = Instance(Viewer).tag(sync=True, **widgets.widget_serialization)
    path = Unicode("http://localhost:8888/ros/pkgs").tag(sync=True)
    robot_model = Dict({}, read_only=True).tag(sync=True)
