import {DOMWidgetModel, DOMWidgetView, unpack_models, WidgetModel} from "@jupyter-widgets/base"
import * as THREE from "three"
import ROSLIB  from "roslib"
import {Viewer, Grid, UrdfClient} from "ros3d"

const _module_name = 'jupyros-widgets';
const _module_version = version;


export class ROSModel extends DOMWidgetModel {

    defaults() {
        return {
            ...super.defaults(),
            _model_name : 'ROSModel',
            _view_name : 'ROSView',
            _model_module : _module_name,
            _view_module : _module_name,
            _model_module_version : _module_version,
            _view_module_version : _module_version,
            socket_url : 'ws://localhost',
            status: 'Disconnected',
            ros_connection: undefined
        }
    }

    initialize(){
        super.initialize.apply(this, arguments);
        this.update_traits();
        this.on("change:socket_url", this.update_traits, this);
    }

    update_traits(){
        if (this.ros_connection !== undefined) this.ros_connection.close();
        this.socket_url = this.get('socket_url');
        this.ros_connection = new ROSLIB.Ros({url : this.socket_url}); 

        this.ros_connection.on("error", (event)=>{
            console.error(`[${_module_name}]:`, event);
            this.status = "Error Occur, Inspect the page";
            this.status_update();
        });

        this.ros_connection.on("connection", ()=>{
            this.status = `Connected to ${this.socket_url}`;
            this.status_update();
        });

        this.ros_connection.on("close", ()=>{
            this.status = "Disconnected";
            this.status_update();
        });
    }

    status_update(){
        this.set('status', this.status);
        this.save_changes();
    }

    get_connection(){
        return this.ros_connection;
    }

}

export class ROSView extends DOMWidgetView{
    render(){
        this.update();
    }
    update(){
        this.el.textContent = this.model.status;
    }
}

export class SubscriberModel extends DOMWidgetModel{

    static serializers = {
        ...super.serializers,
        ros_connection: {
            serialize: WidgetModel.serialize,
            deserialize: unpack_models
        }
    }

    defaults(){
        return {
            ...super.defaults(),
            _model_name : 'SubscriberModel',
            _view_name : 'SubscriberView',
            _model_module : _module_name,
            _view_module : _module_name,
            _model_module_version : _module_version,
            _view_module_version : _module_version,
            topic_name : '',
            msg_type : '',
            throttle_rate:0,
            queue_size:100,
            latch:false,
            queue_length:0,
            widgetHeight:300,
            subscribed_status: undefined,
            start_listening:undefined,
            ros_connection: undefined,
            listener:undefined
        };
    }

    initialize(){
        super.initialize.apply(this, arguments);
        this.on("change", this.update_traits, this);
    }

    update_traits(){
        // if(listener!==undefined)
    }
}

export class SubscriberView extends DOMWidgetView{
    
    render(){
        this.msg_view = document.createElement("div");

        this.update_connection();
        this.updateWidgetHeight();

        this.msg_view.style.overflowY="scroll";

        this.model.on('change:ros_connection', this.update_connection, this);
        this.model.on('change:msg_type', this.update_connection, this);
        this.model.on('change:topic_name', this.update_connection, this);
        this.model.on('change:start_listening', this.update_connection, this);
        this.model.on('change:widgetHeight', this.updateWidgetHeight, this);
        
        this.el.appendChild(this.msg_view);
    }

    update_connection(){
        this.model.ros_connection = this.model.get('ros_connection').ros_connection ;
        this.model.topic_name = this.model.get('topic_name') ;
        this.model.msg_type = this.model.get('msg_type') ;
        this.model.start_listening = this.model.get('start_listening') ;
        this.start_stop_listening();
    }

    updateWidgetHeight(){
        this.model.widget_height = this.model.get('widget_height');
        this.msg_view.style.height = this.model.widget_height;
    }
    
    start_stop_listening(){
        if(!this.model.start_listening && this.model.listener !== undefined) {
            this.model.listener.unsubscribe();
            this.msg_view.appendChild(document.createTextNode('Stopped listening to ' + this.model.listener.name));
            this.msg_view.appendChild(document.createElement('br'));
            this.model.subscribed_status = false
            this.status_update();
            return;
        }
        
        this.model.listener = new ROSLIB.Topic({
            ros: this.model.ros_connection,
            name : this.model.topic_name,
            messageType : this.model.msg_type
        });

        if (!this.model.subscribed_status) { 
            this.msg_view.appendChild(document.createTextNode('Started listening to ' + this.model.listener.name));
            this.msg_view.appendChild(document.createElement('br'));
            this.model.subscribed_status = true; 
            this.status_update();
        }

        this.model.listener.subscribe(
            (message)=>{
                this.msg_view.appendChild(document.createTextNode(this.model.listener.name + ': ' + message.data));
                this.msg_view.appendChild(document.createElement('br'));
            }
        )

    }

    status_update(){
        this.model.set('subscribed_status', this.model.subscribed_status);
        this.model.save_changes();
    }
}

export class ViewerModel extends DOMWidgetModel{
    defaults() {
        return {
            ...super.defaults(),
            model_name : 'ViewerModel',
            _view_name : 'ViewerView',
            _model_module : _module_name,
            _view_module : _module_name,
            _model_module_version : _module_version,
            _view_module_version : _module_version,
            objects : new Set(),
            width : 800,
            height : 600,
            viewer_instance : undefined
        };
    }
    addObject(object){
        console.log("Adding to viewer");
        console.dir(object);

        this.viewer_instance.addObject(object);
    }
}

export class ViewerView extends DOMWidgetView{
    
    render() {
        this.update_width();
        this.update_height();
        this.el.id = "viewerDiv";

        this.displayed.then(
            () =>{
                this.model.viewer_instance = new Viewer({
                    elem: this.el,
                    width: this.model.width,
                    height: this.model.height,
                    antialias : true
                });
                this.model.addObject(new Grid());
                // console.log("addObject : ", true, this.model.viewer_instance);
            }
        );
        this.update_viewer();
    }

    update_viewer(){
        // this.model.addObject(new Grid());
        // let prevObjects = this.model.previous("objects");
        // this.model.objects = this.model.get("objects");
        // for (object of this.model.objects){
        //     if (prevObjects.includes(object)) continue;
        //     this.model.addObject(object)
        // }
    }

    update_width(){
        this.model.width = this.model.get('width');
        this.model.width = this.model.width<1200?this.model.width:1200;
    }
    
    update_height(){
        this.model.height = this.model.get('height');
        this.model.height = this.model.height<1000?this.model.height:1000;
    }
}

export class TFListenerModel extends DOMWidgetModel{

    static serializers = {
        ...super.serializers,
        ros_connection:{
            serialize: WidgetModel.serialize,
            deserialize: unpack_models
        }
    }

    defaults(){
        return {
            ...super.defaults(),
            _model_name : 'TFListenerModel',
            _view_name : 'TFListenerView',
            _model_module : _module_name,
            _view_module : _module_name,
            _model_module_version : _module_version,
            _view_module_version : _module_version,
            widget_height: 300,
            subscribed_status:false,
            fixed_frame:'world',
            angular_thres: 0.01,
            translation_thres: 0.01,
            ros_connection: null,
            tf_client: null,
        }
    }

    // initialize(){
    //     super.initialize(this, arguments);
    //     this.update_connection();
    // }

    update_connection(){
        
        this.ros_connection = this.get('ros_connection').ros_connection;
        this.widget_height = this.get('widget_height');
        this.fixed_frame = this.get('fixed_frame');
        this.angular_thres = this.get('angular_thres');
        this.translation_thres = this.get('translation_thres');

        this.tf_client = new ROSLIB.TFClient({
            ros : this.ros_connection,
            fixedFrame : this.fixed_frame,
            angularThres : this.angular_thres,
            transThres : this.translation_thres
          });
    }
}

export class TFListenerView extends DOMWidgetView{
    render(){
        this.frames_list = document.createElement('p');
        this.frames_list.style.height = this.model.widget_height;
        this.frames_list.style.overflowY="scroll";
        this.el.append(this.frames_list);
        this.model.on("change", this.update_connection, this);
        this.update_connection();
    }
    update_connection(){
        this.model.update_connection();
        
        let frames_list = Object.keys(this.model.tf_client.frameInfos);
        let content = frames_list.length ? 'Currently listening for changes in the following frames<br/>' + frames_list.join("<br/>") : "TFClient not in use.";
        this.frames_list.innerHTML = content;
    }
}

export class URDFViewerModel extends DOMWidgetModel{

    static serializers = {
        ...super.serializers,
        ros_connection: {
            serialize: WidgetModel.serialize,
            deserialize: unpack_models
        },
        tf_client: {
            serialize: WidgetModel.serialize,
            deserialize: unpack_models
        },
        viewer3d:{
            serialize: WidgetModel.serialize,
            deserialize: unpack_models
        },
        // robot_model:{
        //     serialize:  WidgetModel.serialize,
        //     deserialize: WidgetModel.deserialize
        // }
    }

    defaults(){
        
        return {
            ...super.defaults(),
            _model_name : 'URDFViewerModel',
            _view_name : 'URDFViewerView',
            _model_module : _module_name,
            _view_module : _module_name,
            _model_module_version : _module_version,
            _view_module_version : _module_version,
            ros_connection: null,
            tf_client:undefined,
            viewer3d:undefined,
            path:'/',
            robot_model:undefined
        }
    }
    update_connection(){
        this.ros_connection = this.get('ros_connection').ros_connection;
        this.tf_client = this.get('tf_client').tf_client;
        this.viewer3d = this.get('viewer3d');
        this.path = this.get('path');
        
        this.robot_model = new UrdfClient({
            ros: this.ros_connection,
            tfClient: this.tf_client,
            path: this.path,
            rootObject: this.viewer3d.viewer_instance.scene,
        });

        console.log(new map(this.robot_model));
        
    }

}
export class URDFViewerView extends DOMWidgetView{
    
    render(){
        this.model.on("change", this.model.update_connection, this);
        this.model.update_connection();
        
        this.model.set('robot_model', this.model.robot_model);
        this.model.save_changes();
    }

}

console.log("[jupyros-widgets] :", _module_name, _module_version);