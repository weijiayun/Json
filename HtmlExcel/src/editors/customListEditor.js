/**
 * Created by weijiayun on 8/13/16.
 */
import {registerEditor} from './../editors';
import {BaseEditor} from './_baseEditor';

/**
 * @private
 * @editor customListEditor
 * @class CustomListEditor
 */
class CustomListEditor extends BaseEditor {
  beginEditing(initialValue, event) {
    // editorManager return double click event as undefined
    if (event === void 0) {
      let nestedList = this.TD.querySelector('button[class="htButtonRendererlist"]');
      nestedList.click();
    }
  }

  finishEditing() {}
  init() {}
  open() {}
  close() {}
  getValue() {}
  setValue() {}
  focus() {}
}

export {CustomListEditor};

registerEditor('customList', CustomListEditor);
