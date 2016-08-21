/**
 * Created by weijiayun on 8/13/16.
 */
import {empty, addClass, hasClass} from './../helpers/dom/element';
import {equalsIgnoreCase} from './../helpers/string';
import {EventManager} from './../eventManager';
import {getRenderer, registerRenderer} from './../renderers';
import {isKey} from './../helpers/unicode';
import {partial} from './../helpers/function';
import {stopImmediatePropagation, isImmediatePropagationStopped} from './../helpers/dom/event';


/**
 * Button renderer
 *
 * @private
 * @param {Object} instance Handsontable instance
 * @param {Element} TD Table cell where to render
 * @param {Number} row
 * @param {Number} col
 * @param {String|Number} prop Row object property name
 * @param value Value to render (remember to escape unsafe HTML before inserting to DOM!)
 * @param {Object} cellProperties Cell properties (shared by cell renderer and editor)
 */
function customListRenderer(instance, TD, row, col, prop, value, cellProperties) {
    getRenderer('base').apply(this, arguments);
    let button = createButton();
    empty(TD); // TODO identify under what circumstances this line can be removed
    button.setAttribute('data-row', row);
    button.setAttribute('data-col', col);
    TD.appendChild(button);
}

/**
 * Create button element.
 *
 * @returns {Node}
 */
function createButton() {
    let button = document.createElement('button');
    button.className = 'htButtonRendererlist';
    button.setAttribute('autocomplete', 'off');
    button.setAttribute('tabindex', '-1');
    button.innerHTML = "button";
    button.setAttribute('onclick','buttontest()');
    return button.cloneNode(false);
}
function buttontest() {
    alert('i am in!!!!');
}

export {customListRenderer};
registerRenderer('customList', customListRenderer);
