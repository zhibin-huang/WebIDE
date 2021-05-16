import BaseCodeEditor from './BaseCodeEditor2';

class MEditor extends BaseCodeEditor {
  componentWillReceiveProps(newProps) {
    if (newProps.editor && this.editor === newProps.editor) return;
    this.editor = newProps.editor;
    this.me = this.editor.me;
    this.meDOM = this.me.getContainerDomNode();
    this.dom.removeChild(this.dom.children[0]);
    this.dom.appendChild(this.meDOM);
    this.me.focus();
  }
}

export default MEditor;
