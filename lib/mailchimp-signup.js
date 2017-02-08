import jsonp from '@firstandthird/jsonp';
import Domodule from 'domodule';
import { addClass, removeClass } from 'domassist';
import FormObj from 'formobj';

export default class MailchimpSubscribe extends Domodule {
  get required() {
    return {
      actions: ['submit'],
      named: ['submitMessage', 'fields']
    };
  }

  submit(el, e) {
    e.preventDefault();
    const formObj = new FormObj(el);
    const data = formObj.getJSON();
    const url = el.getAttribute('action');
    this.send(url, data);
  }

  send(url, data) {
    const queryArray = Object.keys(data).map((key) => `${key}=${data[key]}`);
    url += `&${queryArray.join('&')}`;
    jsonp(url, this.displayResult.bind(this), 'c');
  }

  displayResult(data) {
    let resultMessage = data.msg || 'Sorry. Unable to subscribe. Please try again later.';
    if (data.result !== 'success') {
      if (data.msg && data.msg.indexOf('already subscribed') !== -1) {
        resultMessage = 'You\'re already subscribed. Thank you.';
      }
    } else {
      resultMessage = 'Thank you!';
    }

    addClass(this.els.fields, 'hide');
    this.els.submitMessage.innerHTML = resultMessage;
    removeClass(this.els.submitMessage, 'hide');
  }
}

Domodule.register('MailchimpSubscribe', MailchimpSubscribe);
