import {DOMWidgetModel, DOMWidgetView} from "@jupyter-widgets/base"
import { version } from "../package.json"
import { ROSLIB } from "roslib"

const _module_name = 'jupyros-widgets';
const _module_version = version;



export class ROSModel extends DOMWidgetModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name : 'ROSModel',
            _view_name : 'ROSView',
            _model_module : 'jupyros-widgets',
            _view_module : 'jupyros-widgets',
            _model_module_version : '0.1.0',
            _view_module_version : '0.1.0',
            socket_url : '',
            ros_connection: null
        }
    }
}

export class ROSView extends DOMWidgetView{
    
    render(){
        this.model.on('change:socket_url', this.socket_url_changed, this);
    }

    socket_url_changed(){
        this.model.ros_connection = new ROSLIB.Ros({url : this.model.get('socket_url')});
        
        this.model.ros_connection.on("open", ()=>{
            console.log("[jupyros-widgets] : ws connected")
        });
        this.model.ros_connection.on("close", ()=>{
            console.log("[jupyros-widgets] : ws disconnected")
        });

        this.el.textContent = this.model.get('socket_url');
    }
}

console.log("[jupyros-widgets] : ${_module_name}");