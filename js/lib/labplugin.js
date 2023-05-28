import * as ROSWidgets from './index';
import {version} from '../package.json';
import {IJupyterWidgetRegistry} from '@jupyter-widgets/base';

export const rosWidgetPlugin = {
  id: 'jupyros-widgets:plugin',
  requires: [IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'jupyros-widgets',
          version: version,
          exports: ROSWidgets
      });
  },
  autoStart: true
};

export default rosWidgetPlugin;
