import jsonp from '@firstandthird/jsonp';
import Domodule from 'domodule';
import { addClass, removeClass, fire } from 'domassist';
import { getQueryString } from 'formobj';

const Events = {
  Subscribe: 'mailchimp:subscribe',
  Error: 'mailchimp:error'
};

class MailchimpSubscribe extends Domodule {
  get defaults() {
    return {
      unableMessage: 'Sorry. Unable to subscribe. Please try again later.',
      thankMessage: 'Thank you!',
      alreadyMessage: 'You\'re already subscribed. Thank you.'
    };
  }

  get required() {
    return {
      actions: ['submit'],
      named: ['submitMessage', 'fields']
    };
  }

  submit(el, e) {
    e.preventDefault();
    const url = el.getAttribute('action');
    const query = getQueryString(el);
    this.send(url, query);
  }

  send(url, data) {
    url += `&${data}`;
    jsonp(url, this.displayResult.bind(this), 'c');
  }

  displayResult(data) {
    let resultMessage = data.msg || this.options.unableMessage;
    let event = Events.Subscribe;

    if (data.result !== 'success') {
      if (data.msg && data.msg.indexOf('already subscribed') !== -1) {
        resultMessage = this.options.alreadyMessage;
      }

      event = Events.Error;
    } else {
      resultMessage = this.options.thankMessage;
      addClass(this.els.fields, 'hide');
    }

    fire(this.el, event, {
      bubbles: true,
      detail: data
    });

    this.els.submitMessage.innerHTML = resultMessage;
    removeClass(this.els.submitMessage, 'hide');
  }
}

Domodule.register('MailchimpSubscribe', MailchimpSubscribe);

export { MailchimpSubscribe, Events as MailchimpSubscribeEvents };
